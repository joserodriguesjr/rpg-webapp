/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Occupation {
  @Field((type) => String)
  name: string;

  @Field((type) => String)
  healthDice: string;

  @Field((type) => String)
  resistanceTest: string;

  @Field((type) => Int)
  proficiency: number;

  @Field((type) => [Skill])
  skills: Skill[];
}

@ObjectType()
export class Skill {
  @Field((type) => String)
  name: string;

  @Field((type) => Int)
  level: number;

  @Field((type) => String)
  description: string;
}
