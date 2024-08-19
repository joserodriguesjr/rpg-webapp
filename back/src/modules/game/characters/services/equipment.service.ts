import { Injectable } from '@nestjs/common';

import { EquipmentRepository } from '../repositories/equipment.repository';
import { Armor, Equipment, Item, Weapon } from '../models/equipments.model';
import { Character } from '../models/character/character.model';

@Injectable()
export class EquipmentService {
  constructor(private readonly equipmentRepository: EquipmentRepository) {}

  async getEquipmentByCharacter(character: Character): Promise<Equipment> {
    const equipments: Equipment = this.equipmentRepository.getEquipments();

    const weapons: Weapon[] = equipments.weapons.filter((weapon) =>
      character.weapons.includes(weapon.name),
    );
    const armors: Armor[] = equipments.armors.filter((armor) =>
      character.armors.includes(armor.name),
    );
    const items: Item[] = equipments.items.filter((item) =>
      character.items.includes(item.name),
    );

    const equipment: Equipment = {
      weapons: weapons,
      armors: armors,
      items: items,
    };

    return equipment;
  }
}
