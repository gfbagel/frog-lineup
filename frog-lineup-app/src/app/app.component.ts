import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
    console.log(event);
    this.artLineup?.sortCharacters(event);
  }

  onCharacterClicked(event: Character) {
    this.characterDetails?.loadCharacterData(event);
  }
}
