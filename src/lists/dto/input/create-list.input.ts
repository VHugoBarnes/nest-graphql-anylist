import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

@InputType()
export class CreateListInput {
  @Field(() => String, { name: "name" })
  @IsNotEmpty()
  @MinLength(2)
  @IsString()
  name: string;
}
