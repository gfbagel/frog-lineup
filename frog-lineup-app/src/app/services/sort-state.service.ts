import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SortType } from '../sort-bar/sort-bar.component';
import { Stats } from '../character-details/character-details.component';

export interface SortState {
  sortType: SortType | null;
  sortStat: keyof Stats | null;
  hideNAChars: boolean | null;
}

@Injectable({
  providedIn: 'root',
})
export class SortStateService {
  private _sortState = new BehaviorSubject<SortState>({
    sortType: SortType.NAME,
    sortStat: null,
    hideNAChars: true,
  });

  // Observable for components to subscribe to
  sortState$ = this._sortState.asObservable();

  // Current sort state value
  get sortState(): SortState {
    return this._sortState.value;
  }

  // Method to update sort state
  updateSortState(state: SortState): void {
    this._sortState.next(state);
  }
}
