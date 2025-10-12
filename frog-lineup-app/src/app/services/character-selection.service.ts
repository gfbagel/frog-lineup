import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Character } from '../character-details/character-details.component';

@Injectable({
  providedIn: 'root',
})
export class CharacterSelectionService {
  private _selectedCharacter = new BehaviorSubject<Character | null>(null);

  // Observable for components to subscribe to
  selectedCharacter$ = this._selectedCharacter.asObservable();

  // Current selected character value
  get selectedCharacter(): Character | null {
    return this._selectedCharacter.value;
  }

  // Method to select a character
  selectCharacter(character: Character | null): void {
    this._selectedCharacter.next(character);
  }

  // Method to clear selection
  clearSelection(): void {
    this._selectedCharacter.next(null);
  }
}
