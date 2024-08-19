export interface Occupation {
  name: string;
  healthDice: string;
  resistanceTest: string;
  proficiency: number;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level: number;
  description: string;
}
