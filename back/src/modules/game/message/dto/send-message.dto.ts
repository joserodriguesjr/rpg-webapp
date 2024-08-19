import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SendMessageInput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  question: string;
}
