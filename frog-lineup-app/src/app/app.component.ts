import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CharacterDetailsComponent } from './character-details/character-details.component';
import { ArtLineupComponent } from './art-lineup/art-lineup.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatButtonToggle,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { SortBarComponent } from './sort-bar/sort-bar.component';

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
  ],
})
export class AppComponent {
  title = 'frog-lineup-app';
}
