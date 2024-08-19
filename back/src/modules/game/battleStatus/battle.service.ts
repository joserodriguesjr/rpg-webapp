import { Injectable } from '@nestjs/common';

import { BattleRepository } from './battle.repository';
import { BattlePlayer, Position } from './models/battle.model';
import { CharacterService } from 'src/modules/game/characters/services/character.service';
import { Character } from 'src/modules/game/characters/models/character/character.model';

@Injectable()
export class BattleService {
  constructor(
    private readonly battleRepository: BattleRepository,
    private readonly characterService: CharacterService,
  ) {}

  async getBattleStatusWithPlayerData(): Promise<BattlePlayer[]> {
    // TODO get char by name/id
    const battleStatus = this.battleRepository.getBattleData();
    const characters = await this.characterService.getAllCharacters();

    battleStatus.map(async (player) => {
      const character = characters.find((char) => char.name === player.name);
      if (character) {
        player.healthMax = character.healthMax;
        player.healthCurrent = character.healthCurrent;
        player.energyMax = character.energyMax;
        player.energyCurrent = character.energyCurrent;
        player.visible = character.visible;
      }
    });

    return battleStatus;
  }

  async updateBattleStatus(
    id: number,
    position: Position,
  ): Promise<BattlePlayer[]> {
    const battleStatus = await this.getBattleStatusWithPlayerData();
    const character = battleStatus.find((character) => character.id === id);
    if (character) {
      character.position = position;
    }

    this.battleRepository.saveBattleData(battleStatus);
    return battleStatus;
  }

  async toogleVisible(name: string): Promise<BattlePlayer[]> {
    const charactersData: Character[] =
      await this.characterService.getAllCharacters();
    const characterIndex = charactersData.findIndex(
      (char) => char.name === name,
    );

    if (characterIndex !== -1) {
      charactersData[characterIndex].visible =
        !charactersData[characterIndex].visible;

      this.characterService.saveCharacters(charactersData);
      return this.getBattleStatusWithPlayerData();
    } else {
      throw new Error('Personagem não encontrado');
    }
  }
}
