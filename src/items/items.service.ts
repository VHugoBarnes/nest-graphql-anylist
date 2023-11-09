import { BadRequestException, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
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

  findAll() {
    return "This action returns all items";
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemInput: UpdateItemInput) {
    return `This action updates a #${id} item`;
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
