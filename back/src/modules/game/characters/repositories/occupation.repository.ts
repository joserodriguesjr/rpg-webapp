import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Occupation } from '../models/occupation.model';

@Injectable()
export class OccupationRepository {
  constructor(private readonly configService: ConfigService) {}

  private readonly occupationsFilePath =
    this.configService.get<string>('file.occupations');

  getOccupations(): Occupation[] {
    return JSON.parse(fs.readFileSync(this.occupationsFilePath, 'utf8'));
  }
}
