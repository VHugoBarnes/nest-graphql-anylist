import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from "@nestjs/graphql";
import { ListsService } from "./lists.service";
import { List } from "./entities/list.entity";
import { CreateListInput, UpdateListInput } from "./dto";
import { ParseUUIDPipe, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/auth/decorators/current-user.decorator";
import { User } from "src/users/entities/user.entity";
import { PaginationArgs, SearchArgs } from "src/common/dto/args";
import { ListItem } from "src/list-item/entities/list-item.entity";
import { ListItemService } from "src/list-item/list-item.service";

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemService: ListItemService
  ) { }

  @Mutation(() => List, { name: "createList" })
  createList(
    @Args("createListInput") createListInput: CreateListInput,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listsService.create(createListInput, user);
  }

  @Query(() => [List], { name: "lists" })
  findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<List[]> {
    return this.listsService.findAll(user, paginationArgs, searchArgs);
  }

  @Query(() => List, { name: "list" })
  findOne(
    @Args("id", { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listsService.findOne(id, user);
  }

  @Mutation(() => List, { name: "updateList" })
  updateList(
    @Args("updateListInput") updateListInput: UpdateListInput,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listsService.update(updateListInput.id, updateListInput, user);
  }

  @Mutation(() => List, { name: "removeList" })
  removeList(
    @Args("id", { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User
  ): Promise<List> {
    return this.listsService.remove(id, user);
  }

  @ResolveField(() => [ListItem], { name: "items" })
  getListItems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<ListItem[]> {
    return this.listItemService.findAll(list, paginationArgs, searchArgs);
  }
}
