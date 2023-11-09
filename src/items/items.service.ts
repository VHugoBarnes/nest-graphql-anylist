import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { CreateItemInput, UpdateItemInput } from "./dto/";
import { Item } from "./entities/item.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ItemsService {
  private readonly logger = new Logger("ItemsService");

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ) { }
  async create(createItemInput: CreateItemInput): Promise<Item> {
    try {
      const newItem = this.itemRepository.create(createItemInput);

      return await this.itemRepository.save(newItem);
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findAll(): Promise<Item[]> {
    return this.itemRepository.find({});
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemRepository.findOneBy({ id: id });

    if (!item) throw new NotFoundException("[item-not-found]");

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    const item = await this.itemRepository.preload(updateItemInput);

    if (!item) throw new NotFoundException("[item-not-found]");

    return this.itemRepository.save(item);
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }

  private handleDbExceptions(error: any) {
    if (error.code === "23505") {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException("Unexpected error, check server logs");
  }
}
