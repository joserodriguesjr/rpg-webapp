export type BattleStatus = Player[];

export interface Player {
  id: number;
  name: string;
  visible: boolean;
  healthMax: number;
  healthCurrent: number;
  energyMax: number;
  energyCurrent: number;
  position: Position;
  icon: string;
}

export interface Position {
  row: number;
  col: number;
}
