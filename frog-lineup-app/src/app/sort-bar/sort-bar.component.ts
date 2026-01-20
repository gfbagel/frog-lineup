import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  OnInit,
  Input,
} from '@angular/core';
import {
  MatButtonToggleGroup,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  Stats,
  Character,
} from '../character-details/character-details.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SortStateService } from '../services/sort-state.service';
import { CharacterSelectionService } from '../services/character-selection.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { map } from 'rxjs/operators';
import { characterList } from '../art-lineup/characterData';
import { CommonModule } from '@angular/common';

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
    MatAutocompleteModule,
    CommonModule,
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
  @Output() characterClicked = new EventEmitter<Character>();

  // Form controls
  SortTypeEnum = SortType;
  sortTypeCtrl = new FormControl<SortType>(SortType.NAME); // Default to NAME
  sortingStatCtrl = new FormControl<keyof Stats>({
    disabled: true,
    value: 'strength',
  });
  hideNACharsCtrl = new FormControl(true);
  statsNames = statsNames;
  characterSearchCtrl = new FormControl('');
  filteredCharacters = this.characterSearchCtrl.valueChanges.pipe(
    map((value) => this.filterCharacters(value || '')),
  );
  allCharacters = characterList.map((char) => ({
    name: char.name,
    img: char.img,
  }));

  constructor(
    private sortStateService: SortStateService,
    private characterSelectionService: CharacterSelectionService,
  ) {
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

  get isSortingByName() {
    if (this.sortTypeCtrl) {
      return this.sortTypeCtrl.value === SortType.NAME;
    } else {
      return false;
    }
  }

  private filterCharacters(
    searchTerm: string,
  ): Array<{ name: string; img: string }> {
    const filterValue = searchTerm.toLowerCase();
    return this.allCharacters.filter((character) =>
      character.name.toLowerCase().includes(filterValue),
    );
  }

  onCharacterSelected(characterImg: string): void {
    // Find the character in the static character list
    const selectedCharacter = characterList.find(
      (char) => char.img === characterImg,
    );

    if (selectedCharacter) {
      // Use the service to select the character
      // This will trigger focus and selection in art-lineup automatically
      this.characterSelectionService.selectCharacter(selectedCharacter);

      // Emit the character click event
      this.characterClicked.emit(selectedCharacter);

      // Clear the search input after selection
      this.characterSearchCtrl.reset('', { emitEvent: false });
    }
  }
}
