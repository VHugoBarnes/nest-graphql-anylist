import { InputType, Field, Float } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";
import { Type } from "class-transformer";

@InputType()
export class CreateItemInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @Field(() => Float)
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  quantity: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @Min(1)
  @IsOptional()
  quantityUnit?: string;
}
