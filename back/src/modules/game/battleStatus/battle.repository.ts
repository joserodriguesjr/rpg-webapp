import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BattlePlayer } from './models/battle.model';

@Injectable()
export class BattleRepository {
  constructor(private configService: ConfigService) {}

  private readonly battleFilePath =
    this.configService.get<string>('file.battle');

  getBattleData(): BattlePlayer[] {
    return JSON.parse(fs.readFileSync(this.battleFilePath, 'utf-8'));
  }

  saveBattleData(newBattleStatus: BattlePlayer[]): void {
    fs.writeFileSync(
      this.battleFilePath,
      JSON.stringify(newBattleStatus, null, 2),
    );
  }
}
