import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  Character,
  CharacterDetailsComponent,
  Stats,
} from './character-details/character-details.component';
import { ArtLineupComponent } from './art-lineup/art-lineup.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SortBarComponent, SortType } from './sort-bar/sort-bar.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    CharacterDetailsComponent,
    ArtLineupComponent,
    MatFormFieldModule,
    MatButtonToggleModule,
    SortBarComponent,
    MatDividerModule,
  ],
})
export class AppComponent {
  @ViewChild('artLineup') artLineup?: ArtLineupComponent;
  @ViewChild('characterDetails') characterDetails?: CharacterDetailsComponent;

  title = 'frog-lineup-app';

  updateLineUpSort(event: {
    sortType: SortType | null;
    sortStat: keyof Stats | null;
    hideNAChars: boolean | null;
  }) {
    this.artLineup?.sortCharacters(event);
  }

  onCharacterClicked(event: Character) {
    if (this.characterDetails) {
      this.characterDetails.character = event;
    }
    // Also apply focus state on the art-lineup when character is selected
    if (this.artLineup) {
      // Find the character in displayedCharacterList by matching the img property
      const displayedCharacter = this.artLineup.displayedCharacterList.find(
        (char) => char.img === event.img,
      );
      if (displayedCharacter) {
        const index =
          this.artLineup.displayedCharacterList.indexOf(displayedCharacter);
        if (index >= 0) {
          this.artLineup.onCharacterClick(displayedCharacter, index, true);
        }
      }
    }
  }
}
