import { Stats } from '../../src/app/character-details/character-details.component';

const PHYS_ATK_KEYS: (keyof Stats)[] = ['strength', 'dexterity'];
export type PhysicalAttackStat = (typeof PHYS_ATK_KEYS)[number];

export enum STATUS {
  ADVANTAGE,
  DISADVANTAGE,
  GUARD,
  EVADE,
  REFLECT,
}

export type ActiveStatus = {
  statusID: STATUS;
  remainingDuration: number;
};
