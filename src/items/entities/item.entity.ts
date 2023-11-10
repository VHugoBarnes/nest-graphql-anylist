import { ObjectType, Field, ID } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "items" })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn("uuid")
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  // @Column()
  // @Field(() => Float)
  // quantity: number;

  @Column({ name: "quantityUnit", nullable: true })
  @Field(() => String, { nullable: true })
  quantityUnit: string;

  @ManyToOne(() => User, (user) => user.items)
  @Field(() => User)
  user: User;
}
