import { characterList } from '../src/app/art-lineup/characterData';
import {
  Character,
  Stats,
} from '../src/app/character-details/character-details.component';

type Attributes = Record<keyof Stats, Atrribute>;

const PHYS_ATK_KEYS: (keyof Stats)[] = ['strength', 'dexterity'];
type PhysicalAttackStat = (typeof PHYS_ATK_KEYS)[number];

enum STATUS {
  ADVANTAGE,
  DISADVANTAGE,
}

const DICE_SIDES = 10;

class Atrribute {
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

//Rolls a 1DX and returns the result. Defaults to DICE_SIDES if no value provided
function roll1DX(maxDiceVal: number = DICE_SIDES): number {
  return Math.floor(Math.random() * maxDiceVal) + 1;
}

class Combatant {
  private readonly _characterMeta: Character;
  protected stats: Attributes;

  private _damageTaken = 0;
  private _manaSpent = 0;
  private _statusEffects: STATUS[] = [];

  constructor(character: Character) {
    this._characterMeta = character;

    const baseStatBlock = {
      strength: new Atrribute(character.stats.strength),
      dexterity: new Atrribute(character.stats.dexterity),
      constitution: new Atrribute(character.stats.constitution),
      intelligence: new Atrribute(character.stats.intelligence),
      wisdom: new Atrribute(character.stats.wisdom),
      charisma: new Atrribute(character.stats.charisma),
      luck: new Atrribute(character.stats.luck),
    };

    this.stats = { ...baseStatBlock };
  }

  get maxHP(): number {
    return 10 + this.stats.constitution.mod + this.stats.wisdom.mod;
  }
  get currentHP(): number {
    return this.maxHP - this._damageTaken;
  }

  get maxMP(): number {
    return (
      5 +
      Math.max(
        this.stats.intelligence.mod,
        this.stats.charisma.mod,
        this.stats.wisdom.mod,
      )
    );
  }
  get currentMP(): number {
    return this.maxMP - this._manaSpent;
  }

  get AC(): number {
    return 10 + this.stats.dexterity.mod;
  }

  isDown() {
    return this.currentHP <= 0;
  }

  takeDamage(amount: number) {
    this._damageTaken += amount;
  }

  heal(amount: number) {
    //no overheal
    this._damageTaken = Math.max(0, this._damageTaken - amount);
  }

  applyStatusEffect(status: STATUS) {
    this._statusEffects.push(status);
  }

  performPhysicalAttack(opponent: Combatant, stat: PhysicalAttackStat) {
    const hitRoll = roll1DX();
    const hitMod = this.getAttackHitMod(stat);
    const totalHit = hitRoll + hitMod;

    if (this.isCritFail(hitRoll)) {
      this.takeDamage(1);
      this.applyStatusEffect(STATUS.DISADVANTAGE);
    }
    //Should there be a situation where both crit and crit fail apply? Or crit but a miss?
    if (this.isCrit(hitRoll)) {
      this.applyStatusEffect(STATUS.ADVANTAGE);
    }

    if (totalHit >= opponent.AC) {
      let totalDmg = this.getAttackDmgBonus(hitRoll, stat);
      if (this.isCrit(hitRoll)) {
        totalDmg += 1;
      }

      opponent.takeDamage(totalDmg);
    }
  }

  getAttackHitMod(attackingStat: keyof Stats): number {
    return this.stats[attackingStat].mod;
  }

  //applies damage bonus based on hitRoll and attacking stat
  getAttackDmgBonus(roll: number, attackingStat: keyof Stats): number {
    //effective +30% +1 damage increase depending on hit (i.e. 1-3 = +1, 4-6 = +2, 7-9 = +3, 10 = +4)
    let dmgBonus = Math.floor((roll - 1) / 3) + 1;

    //currently only strength affects damage
    if (attackingStat === 'strength') {
      dmgBonus += this.stats.strength.mod;
    }

    return dmgBonus;
  }

  isCrit(roll: number): boolean {
    return roll + this.stats.luck.mod > DICE_SIDES;
  }
  isCritFail(roll: number): boolean {
    return roll <= -1 * this.stats.luck.mod;
  }

  getLuckDmgBonus(hitRoll: number): number {
    if (
      this.stats.luck.mod > 0 &&
      hitRoll <= DICE_SIDES + 1 - this.stats.luck.mod
    ) {
      return 1;
    } else {
      return 0;
    }
  }
}

function runSimulation(roundsPerMatchup = 100) {
  const combatants: Record<string, Combatant> = {};

  characterList.forEach((charData) => {
    combatants[charData.img] = new Combatant(charData);
  });

  // Run matchups
  for (let i = 0; i < characterList.length; i++) {
    for (let j = i + 1; j < characterList.length; j++) {
      const charA = combatants[characterList[i].img];
      const charB = combatants[characterList[j].img];
      for (let round = 0; round < roundsPerMatchup; round++) {
        // Reset combatants' stats
        // Simulate fight
      }
    }
  }
}

runSimulation();
