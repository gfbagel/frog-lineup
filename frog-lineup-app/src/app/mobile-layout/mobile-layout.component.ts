import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CharacterSelectionService } from '../services/character-selection.service';
import { Observable } from 'rxjs';
import { Character } from '../character-details/character-details.component';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-mobile-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatTabsModule,
    MatTooltipModule,
    MatIconModule,
  ],
  templateUrl: './mobile-layout.component.html',
  styleUrl: './mobile-layout.component.scss',
})
export class MobileLayoutComponent {
  selectedCharacter$: Observable<Character | null>;
  selectedTabIndex = 0;

  constructor(
    private characterSelectionService: CharacterSelectionService,
    private router: Router,
  ) {
    this.selectedCharacter$ = this.characterSelectionService.selectedCharacter$;

    // Set initial tab based on current route
    this.setTabFromRoute();
  }

  setTabFromRoute() {
    const url = this.router.url;
    if (url.includes('/mobile/stats')) {
      this.selectedTabIndex = 1;
    } else if (url.includes('/mobile/info')) {
      this.selectedTabIndex = 2;
    } else {
      this.selectedTabIndex = 0;
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    const tabIndex = event.index;

    // Check if character is selected for stats/info tabs
    const hasSelectedCharacter =
      this.characterSelectionService.selectedCharacter !== null;

    if ((tabIndex === 1 || tabIndex === 2) && !hasSelectedCharacter) {
      // Prevent navigation and show tooltip handled by template
      return;
    }

    switch (tabIndex) {
      case 0:
        this.router.navigate(['/mobile/lineup']);
        break;
      case 1:
        this.router.navigate(['/mobile/stats']);
        break;
      case 2:
        this.router.navigate(['/mobile/info']);
        break;
    }
  }

  onDisabledTabClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
