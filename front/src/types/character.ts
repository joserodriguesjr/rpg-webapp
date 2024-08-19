import { Occupation } from './occupation';
import { Equipment } from './equipment';
import { Follower } from './followers';

export interface CharacterPartial {
  id: number;
  visible: boolean;
  image: string;
  name: string;
  healthMax: number;
  healthCurrent: number;
  healthDicesCurrent: number;
  energyMax: number;
  energyCurrent: number;
  armorClass: number;
  inspiration: boolean;
  occupationLevel: number;
  virus: {
    name: string;
  };
}

export interface Character {
  id: number;
  visible: boolean;
  image: string;
  name: string;
  story: string;
  events: ImportantEvent[];
  rumours?: string;
  notes: string;
  healthMax: number;
  healthCurrent: number;
  healthDicesCurrent: number;
  energyMax: number;
  energyCurrent: number;
  armorClass: number;
  followers?: Follower[];
  inspiration: boolean;
  attributes: Attributes;
  proficiencies: Proficiency[];
  virus: Virus;
  occupationName: string;
  occupationLevel: number;
  weapons: string[];
  armors: string[];
  items: string[];
  occupation?: Occupation;
  equipment?: Equipment;
}

export interface ImportantEvent {
  event: string;
  description: string;
}

export interface Victim {
  race: string;
  count: number;
}

export interface Attributes {
  for: number;
  des: number;
  con: number;
  int: number;
  sab: number;
  car: number;
}

export interface Proficiency {
  name: string;
  ability: string;
  trained: boolean;
}

export interface Virus {
  name: string;
  assimilation: number;
  powers: Power[];
  consequences: Consequence[];
  languages: Language[];
}

export interface Power {
  name: string;
  description: string;
}

export interface Consequence {
  name: string;
  level: string;
  description: string;
}

export interface Language {
  word: string;
  meaning: string;
}
