import * as fs from 'fs';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Character } from '../models/character/character.model';

@Injectable()
export class CharacterRepository {
  constructor(private configService: ConfigService) {}

  private readonly charactersFilePath =
    this.configService.get<string>('file.characters');

  getCharacters(): Character[] {
    return JSON.parse(fs.readFileSync(this.charactersFilePath, 'utf-8'));
  }

  saveCharacters(newCharacterData: Character[]): void {
    fs.writeFileSync(
      this.charactersFilePath,
      JSON.stringify(newCharacterData, null, 2),
    );
  }
}
