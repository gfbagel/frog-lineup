import {
  Character,
  Stats,
} from '../src/app/character-details/character-details.component';
import { PhysicalAttackStat, STATUS } from './stat-related/Types';
import { DieResult } from './mechanics/DieResult';
import { AttributesManager } from './stat-related/AttributesManager';
import { StatusTracker } from './stat-related/StatusTracker';
import { VitalsTracker } from './stat-related/VitalsTracker';
import { MPActionRegistry } from './mechanics/MPActionRegistry';

export class Combatant {
  private readonly _characterMeta: Character;
  public readonly stats: AttributesManager;
  public readonly statusEffects: StatusTracker;
  public readonly vitals: VitalsTracker;

  public get name(): string {
    return this._characterMeta.name;
  }

  constructor(character: Character) {
    this._characterMeta = character;

    this.stats = new AttributesManager(character.stats);
    this.vitals = new VitalsTracker(this.stats);
    this.statusEffects = new StatusTracker();
  }

  reset() {
    this.vitals.reset();
    this.statusEffects.reset();
    this.stats.resetAll();
  }

  //todo: these "action" methods should return result objects/strings for logging purposes
  performPhysicalAttack(opponent: Combatant, stat: PhysicalAttackStat) {
    const hitRoll = new DieResult(10);
    const hitMod = this.stats.getMod(stat);
    const totalHit = hitRoll.value + hitMod;

    if (hitRoll.isCritFail(this.stats.getMod('luck'))) {
      this.vitals.takeDamage(1);
      this.statusEffects.add(STATUS.DISADVANTAGE, 1);
    }
    //Should there be a situation where both crit and crit fail apply? Or crit but a miss?
    if (hitRoll.isCrit(this.stats.getMod('luck'))) {
      this.statusEffects.add(STATUS.ADVANTAGE, 1);
    }

    if (totalHit >= opponent.vitals.AC) {
      let totalDmg = hitRoll.hitDamageBonus;
      if (stat === 'strength') {
        totalDmg += this.stats.getMod('strength');
      }
      if (hitRoll.isCrit(this.stats.getMod('luck'))) {
        totalDmg += 1;
      }

      opponent.vitals.takeDamage(totalDmg);
    }
  }

  performMPAction(
    mpActionID: keyof typeof MPActionRegistry,
    opponent: Combatant,
  ) {
    MPActionRegistry[mpActionID].resolveEffect(this, opponent);
    this.vitals.spendMP(MPActionRegistry[mpActionID].cost);
  }

  defendGuard() {
    this.statusEffects.add(STATUS.GUARD, 1);
  }

  evade() {
    this.statusEffects.add(STATUS.EVADE, 1);
  }

  onTurnStart() {
    //Resolve things here like regen, poison, etc...

    //Decrement & remove status effects
    this.statusEffects.tickAndRemoveStatuses();
  }
}
