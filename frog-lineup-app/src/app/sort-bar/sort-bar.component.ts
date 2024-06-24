import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  MatButtonToggleGroup,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Stats } from '../character-details/character-details.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

export enum SortType {
  NAME,
  RANK,
  SENIORITY,
  HEIGHT,
  STAT,
  AGE,
}

export interface StatDropDownOption {
  label: string;
  label_short: string;
  value: keyof Stats;
}

export const statsNames: StatDropDownOption[] = [
  {
    label: 'ST Strength',
    label_short: 'ST',
    value: 'strength',
  },
  {
    label: 'DX Dexterity',
    label_short: 'DX',
    value: 'dexterity',
  },
  {
    label: 'CN Constitution',
    label_short: 'CN',
    value: 'constitution',
  },
  {
    label: 'IT Intelligence',
    label_short: 'IT',
    value: 'intelligence',
  },
  {
    label: 'WS Wisdom',
    label_short: 'WS',
    value: 'wisdom',
  },
  {
    label: 'CH Charisma',
    label_short: 'CH',
    value: 'charisma',
  },
  {
    label: 'LK Luck',
    label_short: 'LK',
    value: 'luck',
  },
];

@Component({
  selector: 'app-sort-bar',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
  ],
  templateUrl: './sort-bar.component.html',
  styleUrl: './sort-bar.component.scss',
})
export class SortBarComponent implements AfterViewInit {
  @ViewChild('sortingToggleBtnGrp') sortingToggleBtnGrp?: MatButtonToggleGroup;
  @Output() sortChanged = new EventEmitter<{
    sortType: SortType | null;
    sortStat: keyof Stats | null;
    hideNAChars: boolean | null;
  }>();
  hideNACharsCtrl = new FormControl(true);

  onSortStatChange() {
    this.sortChanged.emit({
      sortStat: this.sortingStatCtrl.value,
      sortType: this.sortTypeCtrl.value,
      hideNAChars: this.hideNACharsCtrl.value,
    });
  }
  onSortChange() {
    if (this.isSortingByStat) {
      this.sortingStatCtrl.enable();
    } else {
      this.sortingStatCtrl.disable();
    }
    this.sortChanged.emit({
      sortStat: this.sortingStatCtrl.value,
      sortType: this.sortTypeCtrl.value,
      hideNAChars: this.hideNACharsCtrl.value,
    });
  }

  ngAfterViewInit() {
    this.onSortChange();
  }

  SortTypeEnum = SortType;
  sortTypeCtrl = new FormControl<SortType>(SortType.NAME);
  sortingStatCtrl = new FormControl<keyof Stats>({
    disabled: !this.isSortingByStat,
    value: 'strength',
  });

  statsNames = statsNames;

  get isSortingByStat() {
    if (this.sortTypeCtrl) {
      return this.sortTypeCtrl.value === SortType.STAT;
    } else {
      return false;
    }
  }
}
