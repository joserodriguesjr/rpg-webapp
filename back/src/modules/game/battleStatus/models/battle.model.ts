/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Position {
  @Field((type) => Int)
  row: number;

  @Field((type) => Int)
  col: number;
}

@ObjectType()
export class BattlePlayer {
  @Field((type) => Int)
  id: number;

  @Field((type) => String)
  name: string;

  @Field((type) => Boolean)
  visible: boolean;

  @Field((type) => Int)
  healthMax: number;

  @Field((type) => Int)
  healthCurrent: number;

  @Field((type) => Int)
  energyMax: number;

  @Field((type) => Int)
  energyCurrent: number;

  @Field((type) => Position)
  position: Position;

  @Field((type) => String)
  icon: string;
}
