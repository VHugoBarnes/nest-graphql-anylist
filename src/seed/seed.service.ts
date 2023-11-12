import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { SEED_USERS, SEED_ITEMS, SEED_LISTS } from "./data/seed-data";

import { List } from "src/lists/entities/list.entity";
import { ListItem } from "src/list-item/entities/list-item.entity";
import { Item } from "src/items/entities/item.entity";
import { User } from "src/users/entities/user.entity";

import { ListsService } from "src/lists/lists.service";
import { UsersService } from "src/users/users.service";
import { ItemsService } from "src/items/items.service";
import { ListItemService } from "src/list-item/list-item.service";

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,

    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
    private readonly listItemService: ListItemService
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

    // Load lists
    const list: List = await this.loadLists(user);

    // Load list items
    const items: Item[] = await this.itemsService.findAll(user, { limit: 15, offset: 0 }, {});
    await this.loadListItems(list, items);

    return true;
  }

  async deleteDatabase() {
    // delete list items
    await this.listItemRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();

    // delete lists
    await this.listRepository.createQueryBuilder()
      .delete()
      .where({})
      .execute();

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

  async loadLists(user: User): Promise<List> {
    const lists = [];

    for (const list of SEED_LISTS) {
      lists.push(await this.listsService.create(list, user));
    }

    return lists[0];
  }

  async loadListItems(list: List, items: Item[]): Promise<void> {
    for (const item of items) {
      this.listItemService.create({
        quantity: Math.round(Math.random() * 21),
        completed: Math.round(Math.random() * 1) === 0 ? false : true,
        listId: list.id,
        itemId: item.id
      });
    }
  }
}
