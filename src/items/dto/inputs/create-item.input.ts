import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

@InputType()
export class CreateItemInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  // @Field(() => Float)
  // @IsNumber()
  // @Type(() => Number)
  // @IsPositive()
  // quantity: number;

  @Field(() => String)
  @IsString()
  @MinLength(2)
  category: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @MinLength(1)
  @IsOptional()
  quantityUnit?: string;
}
