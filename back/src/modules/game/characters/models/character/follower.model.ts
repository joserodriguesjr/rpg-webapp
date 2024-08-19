/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Follower {
  @Field((type) => String)
  type: string;

  @Field((type) => Int)
  quantity: number;
}
