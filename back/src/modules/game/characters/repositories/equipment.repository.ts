import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Equipment } from '../models/equipments.model';

@Injectable()
export class EquipmentRepository {
  constructor(private readonly configService: ConfigService) {}

  private readonly equipmentFilePath =
    this.configService.get<string>('file.equipment');

  getEquipments(): Equipment {
    return JSON.parse(fs.readFileSync(this.equipmentFilePath, 'utf8'));
  }
}
