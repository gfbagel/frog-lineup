import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtLineupComponent } from '../art-lineup/art-lineup.component';
import { SortBarComponent, SortType } from '../sort-bar/sort-bar.component';
import { Character } from '../character-details/character-details.component';

@Component({
  selector: 'app-mobile-lineup',
  standalone: true,
  imports: [CommonModule, ArtLineupComponent, SortBarComponent],
  template: `
    <div class="mobile-screen">
      <h2 class="screen-title">Character Lineup</h2>

      <div class="sort-section">
        <app-sort-bar
          (sortChanged)="onSortChanged($event)"
          (characterClicked)="onSortBarCharacterClicked($event)"
        ></app-sort-bar>
      </div>

      <div class="lineup-section">
        <app-art-lineup
          #artLineup
          (characterClicked)="onArtLineupCharacterClicked($event)"
        >
        </app-art-lineup>
      </div>
    </div>
  `,
  styles: [
    `
      .mobile-screen {
        padding: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .screen-title {
        margin: 0 0 16px 0;
        font-size: 20px;
        font-weight: 600;
        color: #333;
      }

      .sort-section {
        flex-shrink: 0;
      }

      .lineup-section {
        flex: 1;
        min-height: 0;
        overflow-x: auto;
        overflow-y: hidden;
        border-radius: 8px;
        background: white;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;

        /* Smooth scrolling on mobile */
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
      }
    `,
  ],
})
export class MobileLineupComponent {
  @ViewChild('artLineup') artLineup?: ArtLineupComponent;
  @Output() characterClicked = new EventEmitter<Character>();

  onSortChanged(sortEvent: {
    sortType: SortType | null;
    sortStat: keyof Character['stats'] | null;
    hideNAChars: boolean | null;
  }) {
    this.artLineup?.sortCharacters(sortEvent);
  }

  onSortBarCharacterClicked(character: Character) {
    // Find the character in displayed list by matching the img property
    const displayedCharacter = this.artLineup?.displayedCharacterList.find(
      (char) => char.img === character.img,
    );

    if (displayedCharacter) {
      const index =
        this.artLineup?.displayedCharacterList.indexOf(displayedCharacter) ??
        -1;
      if (index >= 0) {
        this.artLineup?.onCharacterClick(displayedCharacter, index, true);
      }
    }
    this.characterClicked.emit(character);
  }

  onArtLineupCharacterClicked(character: Character) {
    this.characterClicked.emit(character);
  }
}
