/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Equipment {
  @Field((type) => [Weapon])
  weapons: Weapon[];

  @Field((type) => [Armor])
  armors: Armor[];

  @Field((type) => [Item])
  items: Item[];
}

@ObjectType()
export class Weapon {
  @Field((type) => String)
  name: string;

  @Field((type) => String)
  damage: string;

  @Field((type) => String)
  effects: string;

  @Field((type) => String)
  value: string;

  @Field((type) => String)
  description: string;
}

@ObjectType()
export class Armor {
  @Field((type) => String)
  name: string;

  @Field((type) => String)
  defense: string;

  @Field((type) => String)
  effects: string;

  @Field((type) => String)
  value: string;

  @Field((type) => String)
  description: string;
}

@ObjectType()
export class Item {
  @Field((type) => String)
  name: string;

  @Field((type) => String)
  effects: string;

  @Field((type) => String)
  value: string;

  @Field((type) => String)
  description: string;
}
