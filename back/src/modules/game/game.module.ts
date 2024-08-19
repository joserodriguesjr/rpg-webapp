import { Module } from '@nestjs/common';
import { CharacterModule } from './characters/character.module';
import { MessageModule } from './message/message.module';
import { BattleModule } from './battleStatus/battle.module';
import { UVTTController } from './map/map.controller';

@Module({
  imports: [CharacterModule, MessageModule, BattleModule],
  controllers: [UVTTController],
})
export class GameModule {}
