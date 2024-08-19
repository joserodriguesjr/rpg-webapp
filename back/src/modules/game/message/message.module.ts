import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PubSubModule } from 'src/pubsub.module';
import { MessageService } from './message.service';
import { MessageRepository } from './message.repository';
import { MessageResolver } from './message.resolver';
import { CharacterModule } from 'src/modules/game/characters/character.module';

@Module({
  imports: [CharacterModule, PubSubModule, HttpModule],
  providers: [MessageResolver, MessageService, MessageRepository],
})
export class MessageModule {}
