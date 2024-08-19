import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateCharacterStatusInput {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  healthCurrent: number;

  @Field(() => Int)
  energyCurrent: number;

  @Field(() => Int)
  healthDicesCurrent: number;

  @Field(() => Boolean)
  inspiration: boolean;
}

@InputType()
export class UpdateCharacterInfoInput {
  @Field(() => Int)
  id: number;

  @Field(() => String, { nullable: true })
  story: string;

  @Field(() => [ImportantEventInput], { nullable: true })
  events: ImportantEventInput[];

  @Field(() => String, { nullable: true })
  notes: string;
}

@InputType()
class ImportantEventInput {
  @Field(() => String)
  event: string;

  @Field(() => String, { nullable: true })
  description?: string;
}
