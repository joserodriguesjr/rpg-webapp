export interface Equipment {
    weapons: Weapon[];
    armors: Armor[];
    items: Item[];
}

export interface Weapon {
    name: string;
    damage: string;
    effects: string;
    value: string;
    description: string;
}

export interface Armor {
    name: string;
    defense: string;
    effects: string;
    value: string;
    description: string;
}

export interface Item {
    name: string;
    effects: string;
    value: string;
    description: string;
}
