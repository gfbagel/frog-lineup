import { Component, ElementRef, ViewChildren } from '@angular/core';
import {
  Character,
  Rank,
  StatMod,
} from '../character-details/character-details.component';

@Component({
  selector: 'app-art-lineup',
  standalone: true,
  imports: [],
  templateUrl: './art-lineup.component.html',
  styleUrl: './art-lineup.component.scss',
})
export class ArtLineupComponent {
  @ViewChildren('imgContainer') imgContainers?: ElementRef<HTMLDivElement>[];
  onImgLeave() {
    this.imgContainers?.forEach((imgDiv) => {
      imgDiv.nativeElement.classList.remove('not-hovered');
    });
  }
  onImgHover(hoverIdx: number) {
    this.imgContainers?.forEach((imgDiv, idx) => {
      if (idx !== hoverIdx) {
        imgDiv.nativeElement.classList.add('not-hovered');
      }
    });
  }
  characterList: Character[] = [
    {
      name: 'Grododu',
      description: '',
      ability: {
        name: 'Genius',
        description: '',
        statAffecting: 'intelligence',
        statValue: 0,
        statModifier: StatMod.ADD,
      },
      weakness: {
        name: 'Disfigured',
        description: '',
        statAffecting: 'dexterity',
        statValue: 0,
        statModifier: StatMod.SUBTRACT,
      },
      stats: {
        strength: 2,
        dexterity: 2,
        constitution: 3,
        intelligence: 6,
        wisdom: 4,
        charisma: 3,
        luck: 5,
      },
      age: 0,
      height: 50,
      rank: Rank.CORPORAL,
    },
    {
      name: 'Grododu 2',
      description: '',
      ability: {
        name: 'Genius',
        description: '',
        statAffecting: 'intelligence',
        statValue: 0,
        statModifier: StatMod.ADD,
      },
      weakness: {
        name: 'Disfigured',
        description: '',
        statAffecting: 'dexterity',
        statValue: 0,
        statModifier: StatMod.SUBTRACT,
      },
      stats: {
        strength: 2,
        dexterity: 2,
        constitution: 3,
        intelligence: 6,
        wisdom: 4,
        charisma: 3,
        luck: 5,
      },
      age: 0,
      height: 60,
      rank: Rank.CORPORAL,
    },
    {
      name: 'Grododu 3',
      description: '',
      ability: {
        name: 'Genius',
        description: '',
        statAffecting: 'intelligence',
        statValue: 0,
        statModifier: StatMod.ADD,
      },
      weakness: {
        name: 'Disfigured',
        description: '',
        statAffecting: 'dexterity',
        statValue: 0,
        statModifier: StatMod.SUBTRACT,
      },
      stats: {
        strength: 2,
        dexterity: 2,
        constitution: 3,
        intelligence: 6,
        wisdom: 4,
        charisma: 3,
        luck: 5,
      },
      age: 0,
      height: 55,
      rank: Rank.CORPORAL,
    },
  ];
}
