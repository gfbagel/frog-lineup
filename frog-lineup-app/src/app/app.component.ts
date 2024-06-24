import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CharacterDetailsComponent } from './character-details/character-details.component';
import { ArtLineupComponent } from './art-lineup/art-lineup.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { SortBarComponent } from './sort-bar/sort-bar.component';
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
  title = 'frog-lineup-app';
}
