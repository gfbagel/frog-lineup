import type { Combatant } from '../Combatant';
import { STATUS } from '../stat-related/Types';
import { DieResult } from './DieResult';

export type MPAction = {
  id: string;
  cost: number;
  resolveEffect: (user: Combatant, target: Combatant) => void;
};

export const MPActionRegistry: Record<string, MPAction> = {
  MPBLAST: {
    id: 'MPBLAST',
    cost: 1,
    resolveEffect: (user: Combatant, target: Combatant) => {
      const hitRoll = new DieResult(10);

      const prefMPMod = Math.max(
        user.stats.getMod('intelligence'),
        user.stats.getMod('wisdom'),
        user.stats.getMod('charisma'),
      );

      const totalHit = hitRoll.value + prefMPMod + 1;

      if (totalHit >= target.vitals.AC) {
        let totalDmg = hitRoll.hitDamageBonus + user.stats.mpPrefMod + 1;
        target.vitals.takeDamage(totalDmg);
      }
    },
  },

  //some random examples... we should be able to handle anything you can think of
  REVOLUTION: {
    id: 'REVOLUTION',
    cost: 1,
    resolveEffect: (user: Combatant, target: Combatant) => {
      target.stats.increase('luck', 1);
      user.stats.decrease('luck', 1);
    },
  },
  SELFDESTRUCT: {
    id: 'SELFDESTRUCT',
    cost: 5,
    resolveEffect: (user: Combatant, target: Combatant) => {
      const hpSnapshot = user.vitals.currentHP;
      user.vitals.takeDamage(hpSnapshot);
      target.vitals.takeDamage(hpSnapshot);
    },
  },
  REFLECTSHIELD: {
    id: 'REFLECTSHIELD',
    cost: 3,
    resolveEffect: (user: Combatant, _target: Combatant) => {
      user.statusEffects.add(STATUS.REFLECT, 1);
    },
  },
  CLEANSE: {
    id: 'CLEANSE',
    cost: 2,
    resolveEffect: (user: Combatant, _target: Combatant) => {
      user.stats.resetAll();
    },
  },
};
