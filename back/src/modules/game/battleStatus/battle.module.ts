import { Module } from '@nestjs/common';
import { PubSubModule } from 'src/pubsub.module';
import { BattleResolver } from './battle.resolver';
import { BattleService } from './battle.service';
import { BattleRepository } from './battle.repository';
import { CharacterModule } from 'src/modules/game/characters/character.module';

@Module({
  imports: [CharacterModule, PubSubModule],
  providers: [BattleResolver, BattleService, BattleRepository],
})
export class BattleModule {}
