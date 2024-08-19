/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ImportantEvent } from './importantEvent.model';
import { Follower } from './follower.model';
import { Victim } from './victim.model';
import { Attributes } from './attributes.model';
import { Proficiency } from './proficiency.model';
import { Virus } from './virus.model';
import { Occupation } from '../occupation.model';
import { Equipment } from '../equipments.model';

// import { ObjectType, Field, Int } from '@nestjs/graphql';
// import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// @ObjectType()
// @Entity()
// export class Note {

//   @Field(() => Int)
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Field()
//   @Column('text', { nullable: false })
//   title: string;

//   @Field()
//   @Column('text', { nullable: false })
//   body: string;

// }

@ObjectType()
export class Character {
  @Field((type) => Int)
  id: number;

  @Field((type) => Boolean)
  visible: boolean;

  @Field((type) => String)
  name: string;

  @Field((type) => String)
  image: string;

  @Field((type) => String)
  story: string;

  @Field((type) => [ImportantEvent])
  events: ImportantEvent[];

  @Field((type) => String, { nullable: true })
  rumours?: string;

  @Field((type) => String)
  notes: string;

  @Field((type) => Int)
  healthMax: number;

  @Field((type) => Int)
  healthCurrent: number;

  @Field((type) => Int)
  healthDicesCurrent: number;

  @Field((type) => Int)
  energyMax: number;

  @Field((type) => Int)
  energyCurrent: number;

  @Field((type) => Int)
  armorClass: number;

  @Field((type) => Boolean)
  inspiration: boolean;

  @Field((type) => [Follower], { nullable: true })
  followers?: Follower[];

  @Field((type) => Attributes)
  attributes: Attributes;

  @Field((type) => [Proficiency])
  proficiencies: Proficiency[];

  @Field((type) => Virus)
  virus: Virus;

  @Field((type) => String)
  occupationName: string;

  @Field((type) => Int)
  occupationLevel: number;

  @Field((type) => [String])
  weapons: string[];

  @Field((type) => [String])
  armors: string[];

  @Field((type) => [String])
  items: string[];

  @Field((type) => Occupation, { nullable: true })
  occupation?: Occupation;

  @Field((type) => Equipment, { nullable: true })
  equipment?: Equipment;
}
