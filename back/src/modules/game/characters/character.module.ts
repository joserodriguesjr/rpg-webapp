import { Module } from '@nestjs/common';
import { PubSubModule } from 'src/pubsub.module';
import { CharacterRepository } from './repositories/character.repository';
import { CharacterService } from './services/character.service';
import { CharacterResolver } from './character.resolver';
import { OccupationRepository } from './repositories/occupation.repository';
import { OccupationService } from './services/occupation.service';
import { EquipmentRepository } from './repositories/equipment.repository';
import { EquipmentService } from './services/equipment.service';

@Module({
  imports: [PubSubModule],
  providers: [
    CharacterResolver,
    CharacterService,
    CharacterRepository,
    EquipmentService,
    EquipmentRepository,
    OccupationService,
    OccupationRepository,
  ],
  exports: [CharacterService],
})
export class CharacterModule {}
