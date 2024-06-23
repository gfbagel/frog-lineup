import { Component, ViewChild } from '@angular/core';
import {
  MatButtonToggleGroup,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Stats } from '../character-details/character-details.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

export enum SortType {
  RANK,
  SENIORITY,
  HEIGHT,
  STAT,
}

export interface StatDropDownOption {
  label: string;
  value: keyof Stats;
}

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
  ],
  templateUrl: './sort-bar.component.html',
  styleUrl: './sort-bar.component.scss',
})
export class SortBarComponent {
  @ViewChild('sortingToggleBtnGrp') sortingToggleBtnGrp?: MatButtonToggleGroup;

  statsNames: StatDropDownOption[] = [
    {
      label: 'ST Strength',
      value: 'strength',
    },
    {
      label: 'DX Dexterity',
      value: 'dexterity',
    },
    {
      label: 'CN Constitution',
      value: 'constitution',
    },
    {
      label: 'IT Intelligence',
      value: 'intelligence',
    },
    {
      label: 'WS Wisdom',
      value: 'wisdom',
    },
    {
      label: 'CH Charisma',
      value: 'charisma',
    },
    {
      label: 'LK Luck',
      value: 'luck',
    },
  ];

  SortTypeEnum = SortType;
  sortTypeCtrl = new FormControl<SortType>(SortType.RANK);
  get isSortingByStat() {
    if (this.sortTypeCtrl) {
      return this.sortTypeCtrl.value === SortType.STAT;
    } else {
      return false;
    }
  }
}
