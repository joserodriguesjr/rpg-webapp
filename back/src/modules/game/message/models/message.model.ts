/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CharacterMessages {
  @Field((type) => String)
  name: string;

  @Field((type) => [Message])
  messages: Message[];
}

@ObjectType()
export class Message {
  @Field((type) => Int)
  id: number;

  @Field((type) => String)
  from: string;

  @Field((type) => String)
  to: string;

  @Field((type) => String)
  time: string;

  @Field((type) => String)
  body: string;
}
