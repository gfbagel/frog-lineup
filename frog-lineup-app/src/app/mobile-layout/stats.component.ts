import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterStatsComponent } from '../character-details/character-stats/character-stats.component';
import {
  Character,
  Stats,
} from '../character-details/character-details.component';
import { CharacterSelectionService } from '../services/character-selection.service';

interface StatItem {
  value: keyof Stats;
  label: string;
  label_short: string;
}

@Component({
  selector: 'app-mobile-stats',
  standalone: true,
  imports: [CommonModule, CharacterStatsComponent],
  template: `
    <div class="mobile-stats-container">
      @if (selectedCharacter) {
        <app-character-stats
          class="full-height-stats"
          [character]="selectedCharacter"
          [statsList]="statsList"
          (statChanged)="onStatChanged($event)"
        >
        </app-character-stats>
      } @else {
        <div class="no-character-message">
          <h2>Character Stats</h2>
          <p>
            Select a character from the lineup to view and edit their stats.
          </p>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .mobile-stats-container {
        height: 100%;
        overflow: hidden;
        background: #f5f5f5;
        display: flex;
        flex-direction: column;
      }

      .full-height-stats {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .no-character-message {
        text-align: center;
        margin-top: 48px;
        color: #333;
        background: white;
        padding: 32px;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .no-character-message h2 {
        margin: 0 0 16px 0;
        font-size: 24px;
      }

      .no-character-message p {
        margin: 0;
        font-size: 16px;
        opacity: 0.9;
      }
    `,
  ],
})
export class StatsComponent implements OnInit {
  selectedCharacter: Character | null = null;

  statsList: StatItem[] = [
    { value: 'strength', label: 'Strength', label_short: 'STR' },
    { value: 'dexterity', label: 'Dexterity', label_short: 'DEX' },
    { value: 'constitution', label: 'Constitution', label_short: 'CON' },
    { value: 'intelligence', label: 'Intelligence', label_short: 'INT' },
    { value: 'wisdom', label: 'Wisdom', label_short: 'WIS' },
    { value: 'charisma', label: 'Charisma', label_short: 'CHA' },
    { value: 'luck', label: 'Luck', label_short: 'LCK' },
  ];

  constructor(private characterSelectionService: CharacterSelectionService) {}

  ngOnInit() {
    // Subscribe to selected character changes
    this.characterSelectionService.selectedCharacter$.subscribe((character) => {
      this.selectedCharacter = character;
    });
  }

  onStatChanged(event: { stat: keyof Stats; value: number }) {
    console.log('Stat changed:', event.stat, event.value);
    // TODO: Update the character's stats through a service
  }
}
