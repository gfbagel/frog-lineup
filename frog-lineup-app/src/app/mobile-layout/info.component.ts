import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterInfoComponent } from '../character-details/character-info/character-info.component';
import { Character } from '../character-details/character-details.component';
import { CharacterSelectionService } from '../services/character-selection.service';

@Component({
  selector: 'app-mobile-info',
  standalone: true,
  imports: [CommonModule, CharacterInfoComponent],
  template: `
    <div class="mobile-info-container">
      @if (selectedCharacter) {
        <app-character-info
          [character]="selectedCharacter"
          [rankDropdownItems]="rankDropdownItems"
        >
        </app-character-info>
      } @else {
        <div class="no-character-message">
          <h2>Character Information</h2>
          <p>Select a character from the lineup to view their information.</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .mobile-info-container {
        height: 100%;
        overflow-y: auto;
        background: #f5f5f5;
        display: flex;
        flex-direction: column;
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
export class MobileInfoComponent implements OnInit {
  selectedCharacter: Character | null = null;
  rankDropdownItems = [
    { value: '0', label: 'None' },
    { value: '1', label: 'Private in Training' },
    { value: '2', label: 'Private' },
    { value: '3', label: 'Corporal' },
    { value: '4', label: 'Sergeant' },
    { value: '5', label: 'Staff Sergeant' },
    { value: '6', label: 'Warrant Officer' },
    { value: '7', label: 'Second Lieutenant' },
    { value: '8', label: 'First Lieutenant' },
    { value: '9', label: 'Captain' },
    { value: '10', label: 'Major' },
    { value: '11', label: 'Lieutenant Colonel' },
    { value: '12', label: 'Colonel' },
    { value: '13', label: 'General' },
  ];

  constructor(private characterSelectionService: CharacterSelectionService) {}

  ngOnInit() {
    // Subscribe to selected character changes
    this.characterSelectionService.selectedCharacter$.subscribe((character) => {
      this.selectedCharacter = character;
    });
  }
}
