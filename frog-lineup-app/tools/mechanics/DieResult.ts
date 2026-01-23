// Dice class for rolling and crit calculations
// Generates a new roll when a new instance is created

export class DieResult {
  public readonly value;

  constructor(private _sides: number) {
    this.value = this.rollNew();
  }

  private rollNew(maxDiceVal: number = this._sides): number {
    return Math.floor(Math.random() * maxDiceVal) + 1;
  }

  //applies damage bonus based on hitRoll and attacking stat
  get hitDamageBonus(): number {
    //effective +30% +1 damage increase depending on hit (i.e. 1-3 = +1, 4-6 = +2, 7-9 = +3, 10 = +4)
    let dmgBonus = Math.floor((this.value - 1) / 3) + 1;
    return dmgBonus;
  }

  isCrit(luckModVal: number): boolean {
    return this.value + luckModVal > this._sides;
  }
  isCritFail(luckModVal: number): boolean {
    return this.value <= -1 * luckModVal;
  }
}
