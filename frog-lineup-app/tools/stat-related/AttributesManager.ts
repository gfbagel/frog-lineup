import { Stats } from '../../src/app/character-details/character-details.component';

export class Attribute {
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

export class AttributesManager {
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
