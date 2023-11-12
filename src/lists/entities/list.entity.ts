import { ObjectType, Field, ID } from "@nestjs/graphql";
import { ListItem } from "src/list-item/entities/list-item.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity("list")
export class List {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String, { name: "name" })
  @Column()
  name: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.lists, { nullable: false, lazy: true })
  @Index("userId-list-index")
  user: User;

  @OneToMany(() => ListItem, (listItem) => listItem.list, { lazy: true })
  // @Field(() => [ListItem])
  listItem: ListItem[];
}
