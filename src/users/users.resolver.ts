import { Resolver, Query, Mutation, Args, ID, ResolveField, Int, Parent } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { UpdateUserInput, ValidRolesArgs } from "./dto";
import { ParseUUIDPipe, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { ValidRoles } from "src/auth/enums/valid-roles.enum";
import { ItemsService } from "src/items/items.service";
import { Item } from "src/items/entities/item.entity";
import { PaginationArgs, SearchArgs } from "src/common/dto/args";
import { ListsService } from "src/lists/lists.service";
import { List } from "src/lists/entities/list.entity";

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService
  ) { }

  @Query(() => [User], { name: "users" })
  findAll(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
    @Args() validRoles: ValidRolesArgs,
  ): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: "user" })
  findOne(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
    @Args("id", { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: "updateUser" })
  updateUser(
    @Args("updateUserInput") updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) user: User
  ) {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Mutation(() => User, { name: "blockUser" })
  blockUser(
    @Args("id", { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField(() => Int, { name: "itemCount" })
  async itemCount(
    @CurrentUser([ValidRoles.admin]) admin: User,
    @Parent() user: User
  ): Promise<number> {
    return this.itemsService.itemCountByUser(user);
  }

  @ResolveField(() => Int, { name: "listCount" })
  async listCount(
    @CurrentUser([ValidRoles.admin]) admin: User,
    @Parent() user: User
  ): Promise<number> {
    return this.listsService.listCountByUser(user);
  }

  @ResolveField(() => [Item], { name: "items" })
  async getItemsByUser(
    @CurrentUser([ValidRoles.admin]) admin: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, paginationArgs, searchArgs);
  }

  @ResolveField(() => [Item], { name: "lists" })
  async getListsByUser(
    @CurrentUser([ValidRoles.admin]) admin: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<List[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }
}
