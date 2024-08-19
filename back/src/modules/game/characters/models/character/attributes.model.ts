/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, Int, ObjectType } from '@nestjs/graphql';

//TODO FIX THIS NONSENSE KEY VALUE

@ObjectType()
export class Attributes {
  @Field((type) => Int)
  for: number;

  @Field((type) => Int)
  des: number;

  @Field((type) => Int)
  con: number;

  @Field((type) => Int)
  int: number;

  @Field((type) => Int)
  sab: number;

  @Field((type) => Int)
  car: number;
}
