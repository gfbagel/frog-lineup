import { Component, Input, OnInit } from '@angular/core';
import { StatDropDownOption, statsNames } from '../sort-bar/sort-bar.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

export interface Character {
  name: string;
  description: string;
  ability: StatAbility;
  weakness: StatAbility;
  stats: Stats;
  age: number;
  height: number;
  rank: Rank;
  img?: string;
}

export interface Stats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  luck: number;
}
export interface StatAbility {
  name: string;
  description: string;
  statAffecting: keyof Stats;
  statValue: number;
  statModifier: StatMod;
}

export enum StatMod {
  ADD,
  SUBTRACT,
}

export enum Rank {
  PRIVATE,
  CORPORAL,
  SERGEANT,
  MAJOR,
}

export const averageStatThreshold = 3;
export const maximumStatThreshold = 6;

export const noDataCharacter: Character = {
  name: '[REDACTED]',
  description: '[REDACTED]',
  ability: {
    name: '[REDACTED]',
    description: '',
    statAffecting: 'intelligence',
    statValue: 0,
    statModifier: StatMod.ADD,
  },
  weakness: {
    name: '[REDACTED]',
    description: '',
    statAffecting: 'dexterity',
    statValue: 0,
    statModifier: StatMod.SUBTRACT,
  },
  stats: {
    strength: 2,
    dexterity: 2,
    constitution: 3,
    intelligence: 5,
    wisdom: 4,
    charisma: 3,
    luck: 5,
  },
  age: 0,
  height: 0,
  rank: Rank.SERGEANT,
};
@Component({
  selector: 'app-character-details',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './character-details.component.html',
  styleUrl: './character-details.component.scss',
})
export class CharacterDetailsComponent implements OnInit {
  statAsModifier(stat: keyof Stats): string {
    const modVal = this.character!.stats[stat] - averageStatThreshold;
    return `${modVal >= 0 ? '+' : ''}${modVal}`;
  }
  @Input() character?: Character;

  characterInfoFormGroup!: FormGroup<{
    name: FormControl;
    ability: FormControl;
    weakness: FormControl;
    description: FormControl;
  }>;

  ngOnInit() {
    if (this.character) {
      this.loadCharacterData(this.character);
    } else {
      this.character = noDataCharacter;
      this.loadCharacterData(noDataCharacter);
    }
  }

  loadCharacterData(character: Character) {
    this.characterInfoFormGroup = new FormGroup({
      name: new FormControl<string>(character.name),
      ability: new FormControl<string>(character.ability.name),
      weakness: new FormControl<string>(character.weakness.name),
      description: new FormControl<string>(character.description),
    });
  }

  protected _statToIterable(statItem: StatDropDownOption) {
    return Array(maximumStatThreshold).fill(
      this.character?.stats[statItem.value],
    );
  }
  statsList = statsNames;
}
