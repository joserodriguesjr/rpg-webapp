import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class SubscribeCharacterInput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;
}
