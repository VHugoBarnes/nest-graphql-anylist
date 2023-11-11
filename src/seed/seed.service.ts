import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Item } from "src/items/entities/item.entity";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import { SEED_USERS, SEED_ITEMS } from "./data/seed-data";
import { UsersService } from "src/users/users.service";
import { ItemsService } from "src/items/items.service";

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,

    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) {
    this.isProd = configService.get("state") === "prod";
  }

  async executeSeed(): Promise<boolean> {
    if (this.isProd) throw new UnauthorizedException("[cant-run-seed]");

    // Clean database
    await this.deleteDatabase();

    // Load users
    const user = await this.loadUsers();

    // Load items
    await this.loadItems(user);
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

  async loadUsers(): Promise<User> {
    const users: User[] = [];

    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }

    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const itemPromises = [];

    for (const item of SEED_ITEMS) {
      itemPromises.push(this.itemsService.create(item, user));
    }

    await Promise.all(itemPromises);
  }
}
