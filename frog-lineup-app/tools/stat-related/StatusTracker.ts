import { ActiveStatus, STATUS } from './Types';

export class StatusTracker {
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
