import { Resolver, Mutation, Args, Query } from "@nestjs/graphql";
import { ListItemService } from "./list-item.service";
import { ListItem } from "./entities/list-item.entity";
import { CreateListItemInput } from "./dto/create-list-item.input";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { List } from "src/lists/entities/list.entity";
import { PaginationArgs, SearchArgs } from "src/common/dto/args";

@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) { }

  @Mutation(() => ListItem)
  createListItem(
    @Args("createListItemInput") createListItemInput: CreateListItemInput,
    // TODO: The user owns the list being updated
  ): Promise<ListItem> {
    return this.listItemService.create(createListItemInput);
  }

  @Query(() => [ListItem], { name: "listItem" })
  findAll(
    // @Args() list: List,
    // @Args() paginationArgs: PaginationArgs,
    // @Args() searchArgs: SearchArgs
  ) {
    // return this.listItemService.findAll(list, paginationArgs, searchArgs);
  }

  // @Query(() => ListItem, { name: "listItem" })
  // findOne(@Args("id", { type: () => Int }) id: number) {
  //   return this.listItemService.findOne(id);
  // }

  // @Mutation(() => ListItem)
  // updateListItem(@Args("updateListItemInput") updateListItemInput: UpdateListItemInput) {
  //   return this.listItemService.update(updateListItemInput.id, updateListItemInput);
  // }

  // @Mutation(() => ListItem)
  // removeListItem(@Args("id", { type: () => Int }) id: number) {
  //   return this.listItemService.remove(id);
  // }
}
