import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CharacterMessages } from './models/message.model';

@Injectable()
export class MessageRepository {
  constructor(private readonly configService: ConfigService) {}

  private readonly messagesFilePath =
    this.configService.get<string>('file.messages');

  getMessageData(): CharacterMessages[] {
    return JSON.parse(fs.readFileSync(this.messagesFilePath, 'utf-8'));
  }

  saveMessageData(newMessageData: CharacterMessages[]): void {
    fs.writeFileSync(
      this.messagesFilePath,
      JSON.stringify(newMessageData, null, 2),
    );
  }
}
