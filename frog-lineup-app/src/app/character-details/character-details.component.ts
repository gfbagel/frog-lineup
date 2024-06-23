import { Component } from '@angular/core';

export interface Character {
  name: string;
  ability: StatAbility;
  weakness: StatAbility;
  stats: Stats;
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
  statValue: number;
  statModifier: StatMod;
}

export enum StatMod {
  ADD,
  SUBTRACT,
}

@Component({
  selector: 'app-character-details',
  standalone: true,
  imports: [],
  templateUrl: './character-details.component.html',
  styleUrl: './character-details.component.scss',
})
export class CharacterDetailsComponent {}
