/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject } from '@nestjs/common';
import {
  Args,
  Query,
  Resolver,
  ResolveField,
  Parent,
  Mutation,
  Subscription,
} from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';

import { Character } from './models/character/character.model';
import { CharacterService } from './services/character.service';
import {
  UpdateCharacterInfoInput,
  UpdateCharacterStatusInput,
} from './dto/inputs/update-character.dto';
import { SubscribeCharacterInput } from './dto/inputs/subscribe-character.dto';

import { Equipment } from './models/equipments.model';
import { EquipmentService } from './services/equipment.service';
import { ExchangeEquipmentInput } from './dto/inputs/exchange-equipment.dto';

import { Occupation } from './models/occupation.model';
import { OccupationService } from './services/occupation.service';

@Resolver((of) => Character)
export class CharacterResolver {
  constructor(
    private readonly characterService: CharacterService,
    private readonly equipmentService: EquipmentService,
    private readonly occupationService: OccupationService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
  ) {}

  // Queries
  @Query((returns) => [Character], { name: 'characters' })
  async getAllCharacters(): Promise<Character[]> {
    return this.characterService.getAllCharacters();
  }

  @Query((returns) => Character, { name: 'character' })
  async getCharacter(
    @Args('name', { type: () => String }) name: string,
  ): Promise<Character> {
    return this.characterService.getCharacterByName(name);
  }

  // Mutations
  @Mutation((returns) => Character)
  async updateCharacterStatus(
    @Args('updateCharacterStatusInput', {
      type: () => UpdateCharacterStatusInput,
    })
    updateCharacterStatusInput: UpdateCharacterStatusInput,
  ): Promise<Character> {
    const updatedCharacter = await this.characterService.updateStatus(
      updateCharacterStatusInput,
    );
    this.pubSub.publish('characterUpdated', {
      characterUpdated: updatedCharacter,
    });
    this.pubSub.publish('battleStatus', {});
    return updatedCharacter;
  }

  @Mutation((returns) => Character)
  async updateCharacterInfo(
    @Args('updateCharacterInfoInput', {
      type: () => UpdateCharacterInfoInput,
    })
    updateCharacterInfoInput: UpdateCharacterInfoInput,
  ): Promise<Character> {
    const updatedCharacter = await this.characterService.updateInfo(
      updateCharacterInfoInput,
    );
    this.pubSub.publish('characterUpdated', {
      characterUpdated: updatedCharacter,
    });
    return updatedCharacter;
  }

  @Mutation((returns) => [Character])
  async exchangeEquipment(
    @Args('exchangeEquipmentInput', { type: () => ExchangeEquipmentInput })
    exchangeEquipmentInput: ExchangeEquipmentInput,
  ): Promise<Character[]> {
    const updatedCharacters = await this.characterService.exchangeEquipment(
      exchangeEquipmentInput,
    );
    updatedCharacters.map((char) =>
      this.pubSub.publish('characterUpdated', { characterUpdated: char }),
    );
    return updatedCharacters;
  }

  // Subscriptions
  @Subscription((returns) => Character, {
    name: 'characterUpdated',
    filter: (payload, variables) =>
      payload.characterUpdated.name === variables.subscribeCharacterInput.name,
  })
  async subscribeToCharacterUpdated(
    @Args('subscribeCharacterInput', { type: () => SubscribeCharacterInput })
    subscribeCharacterInput: SubscribeCharacterInput,
  ): Promise<AsyncIterator<Character>> {
    return this.pubSub.asyncIterator<Character>('characterUpdated');
  }

  // Resolve fields
  @ResolveField((returns) => Equipment, { name: 'equipment', nullable: true })
  async getEquipment(@Parent() character: Character): Promise<Equipment> {
    return this.equipmentService.getEquipmentByCharacter(character);
  }

  @ResolveField((returns) => Occupation, { name: 'occupation', nullable: true })
  async getOccupation(@Parent() character: Character): Promise<Occupation> {
    return this.occupationService.getOccupationByCharacter(character);
  }
}
