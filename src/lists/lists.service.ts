import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { CreateListInput } from "./dto/input/create-list.input";
import { UpdateListInput } from "./dto/input/update-list.input";
import { InjectRepository } from "@nestjs/typeorm";
import { List } from "./entities/list.entity";
import { Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { PaginationArgs, SearchArgs } from "src/common/dto/args";

@Injectable()
export class ListsService {
  private logger: Logger = new Logger(ListsService.name);

  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>
  ) { }

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    try {
      const list = this.listRepository.create({ ...createListInput, user: user });

      return await this.listRepository.save(list);
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findAll(user: User, paginationArgs: PaginationArgs, searchArgs: SearchArgs): Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where("\"userId\" = :userId", { userId: user.id });

    if (search) {
      queryBuilder.andWhere("LOWER(name) like :name", { name: `%${search.toLowerCase()}%` });
    }

    return await queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listRepository.findOne({ where: { id: id, user: { id: user.id } }, relations: ["user"] });

    if (!list) throw new NotFoundException("[list-not-found]");

    return list;
  }

  async update(id: string, updateListInput: UpdateListInput, user: User): Promise<List> {
    await this.findOne(id, user);

    const list = await this.listRepository.preload(updateListInput);

    if (!list) throw new NotFoundException("[list-not-found]");

    return this.listRepository.save(list);
  }

  async remove(id: string, user: User): Promise<List> {
    const list = await this.findOne(id, user);

    await this.listRepository.remove(list);

    return { ...list, id };
  }

  private handleDbExceptions(error: any) {
    if (error.code === "23505") {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException("Unexpected error, check server logs");
  }
}
