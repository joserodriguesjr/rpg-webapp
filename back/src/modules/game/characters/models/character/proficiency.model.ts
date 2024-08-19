/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Proficiency {
  @Field((type) => String)
  name: string;

  @Field((type) => String)
  ability: string;

  @Field((type) => Boolean)
  trained: boolean;
}
