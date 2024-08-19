/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Victim {
  @Field((type) => String)
  race: string;

  @Field((type) => Int)
  count: number;
}
