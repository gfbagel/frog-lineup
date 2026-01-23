import {
  Character,
  Stats,
} from '../src/app/character-details/character-details.component';

const PHYS_ATK_KEYS: (keyof Stats)[] = ['strength', 'dexterity'];
type PhysicalAttackStat = (typeof PHYS_ATK_KEYS)[number];

enum STATUS {
  ADVANTAGE,
  DISADVANTAGE,
  GUARD,
  EVADE,
  REFLECT,
}

type ActiveStatus = {
  statusID: STATUS;
  remainingDuration: number;
};

const DICE_SIDES = 10;

type MPAction = {
  id: string;
  cost: number;
  resolveEffect: (user: Combatant, target: Combatant) => void;
};

const MPActionRegistry: Record<string, MPAction> = {
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

class Attribute {
  get mod(): number {
    return this.current - 3;
  }

  increase(amount: number): void {
    this.current += amount;
  }
  decrease(amount: number): void {
    this.current -= amount;
  }
  reset(): void {
    this.current = this.base;
  }

  constructor(
    public base: number,
    public current: number = base,
  ) {}
}

// Dice class for rolling and crit calculations
// Generates a new roll when a new instance is created
class DieResult {
  public readonly value;

  constructor(private _sides: number) {
    this.value = this.rollNew();
  }

  rollNew(maxDiceVal: number = this._sides): number {
    return Math.floor(Math.random() * maxDiceVal) + 1;
  }

  //applies damage bonus based on hitRoll and attacking stat
  get hitDamageBonus(): number {
    //effective +30% +1 damage increase depending on hit (i.e. 1-3 = +1, 4-6 = +2, 7-9 = +3, 10 = +4)
    let dmgBonus = Math.floor((this.value - 1) / 3) + 1;
    return dmgBonus;
  }

  isCrit(luckModVal: number): boolean {
    return this.value + luckModVal > DICE_SIDES;
  }
  isCritFail(luckModVal: number): boolean {
    return this.value <= -1 * luckModVal;
  }
}

class StatusTracker {
  private _effects: ActiveStatus[] = [];

  add(type: STATUS, duration: number) {
    const existing = this._effects.find((e) => e.statusID === type);
    if (existing) {
      existing.remainingDuration = Math.max(
        existing.remainingDuration,
        duration,
      );
    } else {
      this._effects.push({ statusID: type, remainingDuration: duration });
    }
  }

  has(type: STATUS): boolean {
    return this._effects.some((e) => e.statusID === type);
  }

  // Tick down all durations and remove expired ones
  tickAndRemoveStatuses() {
    this._effects.forEach((e) => e.remainingDuration--);
    this._effects = this._effects.filter((e) => e.remainingDuration > 0);
  }

  reset() {
    this._effects = [];
  }
}

class AttributesManager {
  resetAll() {
    for (const statKey in this._stats) {
      this._stats[statKey as keyof Stats].reset();
    }
  }
  private _stats: Record<keyof Stats, Attribute>;

  getCurrentValue(stat: keyof Stats): number {
    return this._stats[stat].current;
  }

  getMod(stat: keyof Stats): number {
    return this._stats[stat].mod;
  }

  get mpPrefMod(): number {
    return Math.max(
      this.getMod('intelligence'),
      this.getMod('charisma'),
      this.getMod('wisdom'),
    );
  }

  increase(stat: keyof Stats, amount: number): void {
    this._stats[stat].increase(amount);
  }
  decrease(stat: keyof Stats, amount: number): void {
    this._stats[stat].decrease(amount);
  }

  constructor(initialStats: Stats) {
    this._stats = {
      strength: new Attribute(initialStats.strength),
      dexterity: new Attribute(initialStats.dexterity),
      constitution: new Attribute(initialStats.constitution),
      intelligence: new Attribute(initialStats.intelligence),
      wisdom: new Attribute(initialStats.wisdom),
      charisma: new Attribute(initialStats.charisma),
      luck: new Attribute(initialStats.luck),
    };
  }
}

class VitalsTracker {
  private _damageTaken = 0;
  private _manaSpent = 0;

  constructor(private stats: AttributesManager) {}

  get maxHP(): number {
    return 10 + this.stats.getMod('constitution') + this.stats.getMod('wisdom');
  }
  get currentHP(): number {
    return this.maxHP - this._damageTaken;
  }

  get maxMP(): number {
    return (
      5 +
      Math.max(
        this.stats.getMod('intelligence'),
        this.stats.getMod('charisma'),
        this.stats.getMod('wisdom'),
      )
    );
  }
  get currentMP(): number {
    return this.maxMP - this._manaSpent;
  }

  get AC(): number {
    return 10 + this.stats.getMod('dexterity');
  }

  get isDown() {
    return this.currentHP <= 0;
  }

  reset() {
    this._damageTaken = 0;
    this._manaSpent = 0;
  }

  takeDamage(amount: number) {
    this._damageTaken += amount;
  }

  spendMP(amount: number) {
    this._manaSpent += amount;
  }

  heal(amount: number) {
    //no overheal
    this._damageTaken = Math.max(0, this._damageTaken - amount);
  }
}

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
