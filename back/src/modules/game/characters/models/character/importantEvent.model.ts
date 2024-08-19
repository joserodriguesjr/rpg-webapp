/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ImportantEvent {
  @Field((type) => String)
  event: string;

  @Field((type) => String, { nullable: true })
  description?: string;
}
