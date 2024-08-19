/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Virus {
  @Field((type) => String)
  name: string;

  @Field((type) => Int)
  assimilation: number;

  @Field((type) => [Power])
  powers: Power[];

  @Field((type) => [Consequence])
  consequences: Consequence[];

  @Field((type) => [Language])
  languages: Language[];
}

@ObjectType()
class Power {
  @Field((type) => String)
  name: string;

  @Field((type) => String)
  description: string;
}

@ObjectType()
class Consequence {
  @Field((type) => String)
  name: string;

  @Field((type) => Int)
  level: number;

  @Field((type) => String)
  description: string;
}

@ObjectType()
class Language {
  @Field((type) => String)
  word: string;

  @Field((type) => String)
  meaning: string;
}
