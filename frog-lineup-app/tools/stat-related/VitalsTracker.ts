import { AttributesManager } from './AttributesManager';

export class VitalsTracker {
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
