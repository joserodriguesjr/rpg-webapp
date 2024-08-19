import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ExchangeEquipmentInput {
  @Field(() => String)
  from: string;

  @Field(() => String)
  to: string;

  @Field(() => String)
  type: string;

  @Field(() => String)
  equipment: string;
}
