import { Injectable } from '@nestjs/common';

import { OccupationRepository } from '../repositories/occupation.repository';
import { Occupation, Skill } from '../models/occupation.model';
import { Character } from '../models/character/character.model';

@Injectable()
export class OccupationService {
  constructor(private readonly occupationRepository: OccupationRepository) {}

  async getOccupationByCharacter(character: Character): Promise<Occupation> {
    const occupations: Occupation[] =
      this.occupationRepository.getOccupations();

    const occupation = occupations.find(
      (occupation) => occupation.name === character.occupationName,
    );
    const filteredSkills: Skill[] = occupation.skills.filter(
      (skill) => skill.level <= character.occupationLevel,
    );

    occupation.skills = filteredSkills;

    return occupation;
  }
}
