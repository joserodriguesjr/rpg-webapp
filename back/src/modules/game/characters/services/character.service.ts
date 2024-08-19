import { Injectable } from '@nestjs/common';

import { CharacterRepository } from '../repositories/character.repository';
import { Character } from '../models/character/character.model';
import {
  UpdateCharacterInfoInput,
  UpdateCharacterStatusInput,
} from '../dto/inputs/update-character.dto';

import { ExchangeEquipmentInput } from '../dto/inputs/exchange-equipment.dto';
import { EquipmentService } from 'src/modules/game/characters/services/equipment.service';
import { OccupationService } from 'src/modules/game/characters/services/occupation.service';

// import { UpdateCharacterDto } from './dto/update-character.dto'; TODO
// import { UpdateEquipmentDto } from './dto/update-equipment.dto'; TODO

@Injectable()
export class CharacterService {
  constructor(
    private readonly characterRepository: CharacterRepository,
    private readonly equipmentService: EquipmentService,
    private readonly occupationService: OccupationService,
  ) {}

  saveCharacters(characters: Character[]): void {
    this.characterRepository.saveCharacters(characters);
  }

  async getAllCharacters(): Promise<Character[]> {
    return this.characterRepository.getCharacters();
  }

  // TODO - Adicionar tratamento de erro
  async getCharacterById(id: number): Promise<Character> {
    const characters: Character[] = await this.getAllCharacters();
    const character = characters.find((char) => char.id === id);
    character.equipment =
      await this.equipmentService.getEquipmentByCharacter(character);
    character.occupation =
      await this.occupationService.getOccupationByCharacter(character);
    return character;
  }

  // TODO - Adicionar tratamento de erro
  async getCharacterByName(name: string): Promise<Character> {
    const characters: Character[] = await this.getAllCharacters();
    const character = characters.find((char) => char.name === name);
    character.equipment =
      await this.equipmentService.getEquipmentByCharacter(character);
    character.occupation =
      await this.occupationService.getOccupationByCharacter(character);
    return character;
  }

  async updateStatus(
    updateCharacterStatusInput: UpdateCharacterStatusInput,
  ): Promise<Character> {
    const charactersData: Character[] = await this.getAllCharacters();
    const characterIndex = charactersData.findIndex(
      (char) => char.id === updateCharacterStatusInput.id,
    );

    if (characterIndex !== -1) {
      charactersData[characterIndex].healthCurrent =
        updateCharacterStatusInput.healthCurrent;
      charactersData[characterIndex].energyCurrent =
        updateCharacterStatusInput.energyCurrent;
      charactersData[characterIndex].healthDicesCurrent =
        updateCharacterStatusInput.healthDicesCurrent;
      charactersData[characterIndex].inspiration =
        updateCharacterStatusInput.inspiration;

      this.saveCharacters(charactersData);
      return charactersData[characterIndex];
    } else {
      throw new Error('Personagem não encontrado');
    }
  }

  async updateInfo(
    updateCharacterInfoInput: UpdateCharacterInfoInput,
  ): Promise<Character> {
    const charactersData: Character[] = await this.getAllCharacters();
    const characterIndex = charactersData.findIndex(
      (char) => char.id === updateCharacterInfoInput.id,
    );

    if (characterIndex !== -1) {
      charactersData[characterIndex].events = updateCharacterInfoInput.events
        ? updateCharacterInfoInput.events
        : charactersData[characterIndex].events;

      charactersData[characterIndex].story = updateCharacterInfoInput.story
        ? updateCharacterInfoInput.story
        : charactersData[characterIndex].story;
      charactersData[characterIndex].notes = updateCharacterInfoInput.notes
        ? updateCharacterInfoInput.notes
        : charactersData[characterIndex].notes;

      this.saveCharacters(charactersData);
      return charactersData[characterIndex];
    } else {
      throw new Error('Personagem não encontrado');
    }
  }

  async exchangeEquipment(
    exchangeEquipmentInput: ExchangeEquipmentInput,
  ): Promise<Character[]> {
    const { from, to, type, equipment } = exchangeEquipmentInput;

    const charactersData: Character[] = await this.getAllCharacters();
    const fromCharacterIndex = charactersData.findIndex(
      (char) => char.name === from,
    );
    const toCharacterIndex = charactersData.findIndex(
      (char) => char.name === to,
    );

    if (fromCharacterIndex !== -1 && toCharacterIndex !== -1) {
      const fromCharacter = charactersData[fromCharacterIndex];
      const toCharacter = charactersData[toCharacterIndex];

      if (type === 'weapons' || type === 'armors' || type === 'items') {
        if (fromCharacter[type].includes(equipment)) {
          fromCharacter[type] = fromCharacter[type].filter(
            (item) => item !== equipment,
          );
          toCharacter[type].push(equipment);
        } else {
          throw new Error('O item não está presente no personagem de origem.');
        }
      } else {
        throw new Error('Tipo inválido.');
      }

      this.saveCharacters(charactersData);
      return [fromCharacter, toCharacter];
    } else {
      throw new Error('Personagem não encontrado.');
    }
  }
}
