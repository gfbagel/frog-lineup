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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { KeyValuePipe } from '@angular/common';

export interface Character {
  name: string;
  description: string;
  ability?: StatAbility;
  weakness?: StatAbility;
  stats: Stats;
  age: number;
  height: number;
  rank: Rank;
  serviceYrs: number;
  isActiveService: boolean;

  generation?: Generation;
  age_detailed?: string;

  adjustedImgScalePct?: number;
  img?: string;

  /**
   * Don't touch this
   */
  _adjustedHeightBasis?: number;
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
  NONE,
  PRIVATE_IN_TRAINING,
  PRIVATE_3RD,
  PRIVATE_2ND,
  PRIVATE_1ST,
  PRIVATE_SUPERIOR,
  CORPORAL_LANCE,
  CORPORAL,
  SERGEANT,
  SERGEANT_MAJOR,
  OFFICER_WARRANT,
  LIEUTENANT_2ND,
  LIEUTENANT,
  CAPTAIN,
  MAJOR,
  COLONEL_LIEUTENANT,
  COLONEL,
  GENERAL_MAJOR,
  GENERAL_LIEUTENANT,
  GENERAL,
  COMMANDER_IN_CHIEF,
}

export enum Generation {
  GEN_0,
  GEN_1,
  GEN_2,
  GEN_3,
  GEN_4,
}

export const averageStatThreshold = 3;
export const maximumStatThreshold = 6;

export const _REDACTEDTXT = '[REDACTED]';

export const noDataCharacter: Character = {
  name: _REDACTEDTXT,
  description: _REDACTEDTXT,
  // ability: {
  //   name: _REDACTEDTXT,
  //   description: '',
  //   statAffecting: 'intelligence',
  //   statValue: 1,
  //   statModifier: StatMod.ADD,
  // },
  // weakness: {
  //   name: _REDACTEDTXT,
  //   description: '',
  //   statAffecting: 'dexterity',
  //   statValue: 1,
  //   statModifier: StatMod.SUBTRACT,
  // },
  stats: {
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
    luck: 0,
  },
  age: 0,
  height: 0,
  rank: Rank.NONE,
  serviceYrs: 0,
  isActiveService: true,
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type FormGrpControls<T> = Record<keyof T, FormControl>;

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
    MatSlideToggleModule,
    MatSelectModule,
    KeyValuePipe,
  ],
  templateUrl: './character-details.component.html',
  styleUrl: './character-details.component.scss',
})
export class CharacterDetailsComponent implements OnInit {
  @Input() character?: Character;

  characterInfoFormGroup!: FormGroup<FormGrpControls<Character>>;

  RankEnum = Rank;
  rankDropdownItems: { value: Rank; label: string }[] = Object.keys(Rank)
    .filter((f) => !isNaN(+f))
    .map((x) => ({ label: Rank[+x], value: +x }));

  ngOnInit() {
    if (this.character) {
      this.loadCharacterData(this.character);
    } else {
      this.character = noDataCharacter;
      this.loadCharacterData(noDataCharacter);
    }
  }

  statAsModifier(stat: keyof Stats): string {
    let modVal = this.character!.stats[stat] - averageStatThreshold;
    if (
      this.character?.ability &&
      this.character.ability.statAffecting === stat
    ) {
      modVal += this.character.ability.statValue;
    }
    if (
      this.character?.weakness &&
      this.character.weakness.statAffecting === stat
    ) {
      modVal -= this.character.weakness.statValue;
    }
    return `${modVal >= 0 ? '+' : ''}${modVal}`;
  }

  loadCharacterData(character: Character) {
    this.character = character;
    this.characterInfoFormGroup = new FormGroup({
      name: new FormControl<string>(character.name),
      ability: new FormControl<string>(character.ability?.name ?? _REDACTEDTXT),
      weakness: new FormControl<string>(
        character.weakness?.name ?? _REDACTEDTXT,
      ),
      description: new FormControl<string>(character.description),
      age: new FormControl(character.age),
      height: new FormControl(character.height),
      rank: new FormControl(character.rank),
      serviceYrs: new FormControl(character.serviceYrs),
      isActiveService: new FormControl(character.isActiveService),
      generation: new FormControl(character.generation),
      age_detailed: new FormControl(character.age_detailed),
      adjustedImgScalePct: new FormControl(character.adjustedImgScalePct),
    } as FormGrpControls<Character>);
  }

  onImgScaleChange() {
    this.character!.adjustedImgScalePct =
      this.characterInfoFormGroup.value.adjustedImgScalePct;
  }

  protected _statToIterable(statItem: StatDropDownOption) {
    return Array(maximumStatThreshold).fill(
      this.character?.stats[statItem.value],
    );
  }
  statsList = statsNames;
}
