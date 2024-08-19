/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Subscription } from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';

import { BattlePlayer } from './models/battle.model';
import { BattleService } from './battle.service';
import { BattlePlayerInput } from './dto/battle-status.dto';

@Resolver((of) => BattlePlayer)
export class BattleResolver {
  constructor(
    private readonly battleService: BattleService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
  ) {}

  // Queries
  @Query((returns) => [BattlePlayer], { name: 'battleStatus' })
  async getBattleStatus(): Promise<BattlePlayer[]> {
    return this.battleService.getBattleStatusWithPlayerData();
  }

  // Mutations
  @Mutation((returns) => [BattlePlayer])
  async updateBattleStatus(
    @Args('battleStatus', {
      type: () => BattlePlayerInput,
    })
    bs: BattlePlayerInput,
  ): Promise<BattlePlayer[]> {
    const updatedBattleStatus = this.battleService.updateBattleStatus(
      bs.id,
      bs.position,
    );
    this.pubSub.publish('battleStatus', {
      battleStatus: updatedBattleStatus,
    });
    return updatedBattleStatus;
  }

  @Mutation((returns) => [BattlePlayer])
  async toogleVisible(
    @Args('name', { type: () => String }) name: string,
  ): Promise<BattlePlayer[]> {
    const updatedBattleStatus = this.battleService.toogleVisible(name);
    this.pubSub.publish('battleStatus', {
      battleStatus: updatedBattleStatus,
    });
    return updatedBattleStatus;
  }

  // Subscriptions
  @Subscription((returns) => [BattlePlayer], {
    name: 'battleStatus',
    resolve(this: BattleResolver, value: object) {
      if (Object.keys(value).length == 0) {
        return this.battleService.getBattleStatusWithPlayerData();
      }
      return value['battleStatus'];
    },
  })
  async subscribeToBattleStatus(): Promise<AsyncIterator<BattlePlayer[]>> {
    return this.pubSub.asyncIterator<BattlePlayer[]>('battleStatus');
  }

  // Resolve fields
}
