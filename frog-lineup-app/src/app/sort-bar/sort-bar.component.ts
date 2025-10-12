import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  OnInit,
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
import { SortStateService } from '../services/sort-state.service';

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
export class SortBarComponent implements OnInit {
  @ViewChild('sortingToggleBtnGrp') sortingToggleBtnGrp?: MatButtonToggleGroup;
  @Output() sortChanged = new EventEmitter<{
    sortType: SortType | null;
    sortStat: keyof Stats | null;
    hideNAChars: boolean | null;
  }>();

  // Form controls
  SortTypeEnum = SortType;
  sortTypeCtrl = new FormControl<SortType>(SortType.NAME); // Default to NAME
  sortingStatCtrl = new FormControl<keyof Stats>({
    disabled: true,
    value: 'strength',
  });
  hideNACharsCtrl = new FormControl(true);
  statsNames = statsNames;

  constructor(private sortStateService: SortStateService) {
    // Restore form controls from saved state
    const savedState = this.sortStateService.sortState;
    this.sortTypeCtrl.setValue(savedState.sortType || SortType.NAME);
    this.sortingStatCtrl.setValue(savedState.sortStat || 'strength');
    this.hideNACharsCtrl.setValue(savedState.hideNAChars ?? true);

    // Update disabled state of stat control
    if (savedState.sortType === SortType.STAT) {
      this.sortingStatCtrl.enable();
    }
  }

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

  ngOnInit() {
    this.sortTypeCtrl.valueChanges.subscribe((sortType) => {
      if (sortType === SortType.STAT) {
        this.sortingStatCtrl.enable();
      } else {
        this.sortingStatCtrl.disable();
      }

      this.emit();
    });

    this.sortingStatCtrl.valueChanges.subscribe(() => this.emit());
    this.hideNACharsCtrl.valueChanges.subscribe(() => this.emit());
  }

  emit() {
    // Save current state to service
    this.sortStateService.updateSortState({
      sortType: this.sortTypeCtrl.value || SortType.NAME,
      sortStat: this.sortingStatCtrl.value,
      hideNAChars: this.hideNACharsCtrl.value || false,
    });

    // Emit the change
    this.sortChanged.emit({
      sortStat: this.sortingStatCtrl.value,
      sortType: this.sortTypeCtrl.value,
      hideNAChars: this.hideNACharsCtrl.value,
    });
  }

  get isSortingByStat() {
    if (this.sortTypeCtrl) {
      return this.sortTypeCtrl.value === SortType.STAT;
    } else {
      return false;
    }
  }
}
