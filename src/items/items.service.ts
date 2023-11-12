import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { CreateItemInput, UpdateItemInput } from "./dto/";
import { Item } from "./entities/item.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { PaginationArgs, SearchArgs } from "src/common/dto/args";

@Injectable()
export class ItemsService {
  private readonly logger = new Logger("ItemsService");

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ) { }

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    try {
      const newItem = this.itemRepository.create({ ...createItemInput, user: user });

      return await this.itemRepository.save(newItem);
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findAll(ofUser: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<Item[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.itemRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where("\"userId\" = :userId", { userId: ofUser.id });

    if (search) {
      queryBuilder.andWhere("LOWER(name) like :name", { name: `%${search.toLowerCase()}%` });
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemRepository.findOne({ where: { id: id, user: { id: user.id } }, relations: ["user"] });

    if (!item) throw new NotFoundException("[item-not-found]");

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    await this.findOne(id, user);

    const item = await this.itemRepository.preload(updateItemInput);

    if (!item) throw new NotFoundException("[item-not-found]");

    return this.itemRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user);

    await this.itemRepository.remove(item);

    return { ...item, id };
  }

  async itemCountByUser(user: User): Promise<number> {
    return this.itemRepository.count({
      where: {
        user: {
          id: user.id
        }
      }
    });
  }

  private handleDbExceptions(error: any) {
    if (error.code === "23505") {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException("Unexpected error, check server logs");
  }
}
