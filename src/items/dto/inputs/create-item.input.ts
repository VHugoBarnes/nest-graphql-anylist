import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString, Min, MinLength } from "class-validator";

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

  @Field(() => String, { nullable: true })
  @IsString()
  @Min(1)
  @IsOptional()
  quantityUnit?: string;
}
