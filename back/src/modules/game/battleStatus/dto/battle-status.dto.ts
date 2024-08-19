/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
class PositionInput {
  @Field((type) => Int)
  row: number;

  @Field((type) => Int)
  col: number;
}

@InputType()
export class BattlePlayerInput {
  @Field((type) => Int)
  id: number;

  @Field((type) => PositionInput)
  position: PositionInput;
}
