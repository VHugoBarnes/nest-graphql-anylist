import { InputType, Field } from "@nestjs/graphql";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  fullName: string;

  @Field(() => String)
  @MinLength(6)
  password: string;
}
