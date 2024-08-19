/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Subscription } from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';

import { Message } from './models/message.model';
import { MessageService } from './message.service';
import { SendMessageInput } from './dto/send-message.dto';
import { SubscribeCharacterInput } from 'src/modules/game/characters/dto/inputs/subscribe-character.dto';

@Resolver((of) => Message)
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
  ) {}

  // Queries
  @Query((returns) => [Message], { name: 'messages' })
  async getMessages(
    @Args('name', { type: () => String }) name: string,
  ): Promise<Message[]> {
    return this.messageService.getMessagesByName(name);
  }

  // Mutations
  @Mutation((returns) => [Message])
  async sendMessage(
    @Args('sendMessageInput', {
      type: () => SendMessageInput,
    })
    sendMessageInput: SendMessageInput,
  ): Promise<Message[]> {
    const newMessages = await this.messageService.sendMessage(
      sendMessageInput.name,
      sendMessageInput.question,
    );
    this.pubSub.publish('messages', {
      messages: newMessages,
    });
    return newMessages;
  }

  // Subscriptions
  @Subscription((returns) => [Message], {
    name: 'messages',
    filter: (payload, variables) =>
      payload.messages.at(-1).from === variables.subscribeCharacterInput.name,
  })
  async subscribeToMessageSent(
    @Args('subscribeCharacterInput', { type: () => SubscribeCharacterInput })
    subscribeCharacterInput: SubscribeCharacterInput,
  ): Promise<AsyncIterator<Message[]>> {
    return this.pubSub.asyncIterator<Message[]>('messages');
  }

  // Resolve fields
}
