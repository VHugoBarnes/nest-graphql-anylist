import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Item } from "src/items/entities/item.entity";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>
  ) {
    this.isProd = configService.get("state") === "prod";
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) throw new UnauthorizedException("[cant-run-seed]");

    // Clean database
    await this.deleteDatabase();

    // Load users

    // Load items
    return true;
  }

  async deleteDatabase() {
    // delete items
    await this.itemRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // delete users
    await this.userRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }
}
