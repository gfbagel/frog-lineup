import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Character, Stats } from '../character-details.component';

interface StatItem {
  value: keyof Stats;
  label: string;
  label_short: string;
}

@Component({
  selector: 'app-character-stats',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './character-stats.component.html',
  styleUrl: './character-stats.component.scss',
})
export class CharacterStatsComponent {
  @Input() character: Character | null = null;
  @Input() statsList: StatItem[] = [];
  @Output() statChanged = new EventEmitter<{
    stat: keyof Stats;
    value: number;
  }>();

  getStatValue(statName: keyof Stats): number {
    return this.character?.stats?.[statName] || 0;
  }

  getEffectiveStatValue(statName: keyof Stats): number {
    let baseValue = this.getStatValue(statName);

    // Apply weakness reduction to the displayed fill
    if (this.character?.weakness?.statAffecting === statName) {
      const weaknessReduction = this.character.weakness.statValue || 1;
      baseValue = Math.max(0, baseValue - weaknessReduction);
    }

    return baseValue;
  }

  getModifierFillWidth(statName: keyof Stats): number {
    if (this.character?.ability?.statAffecting === statName) {
      // Ability: only the bonus area width
      const abilityBonus = this.character.ability.statValue || 1;
      return Math.min(100, (abilityBonus / 6) * 100);
    }

    if (this.character?.weakness?.statAffecting === statName) {
      // Weakness: only the lost area width
      const weaknessReduction = this.character.weakness.statValue || 1;
      return Math.min(100, (weaknessReduction / 6) * 100);
    }

    // No modifier
    return 0;
  }

  getModifierFillLeft(statName: keyof Stats): number {
    const baseValue = this.getStatValue(statName);

    if (this.character?.ability?.statAffecting === statName) {
      // Ability: start after the base stat fill
      return (baseValue / 6) * 100;
    }

    if (this.character?.weakness?.statAffecting === statName) {
      // Weakness: start at the position where the weakness begins affecting
      // This should overlay the area that's being "lost"
      const weaknessReduction = this.character.weakness.statValue || 1;
      const startPosition = Math.max(0, baseValue - weaknessReduction);
      return (startPosition / 6) * 100;
    }

    // No modifier
    return 0;
  }

  statAsModifier(statName: keyof Stats): string {
    const baseValue = this.getStatValue(statName);
    let finalValue = baseValue;

    // Apply ability bonus
    if (this.character?.ability?.statAffecting === statName) {
      finalValue += this.character.ability.statValue || 1;
    }

    // Apply weakness reduction
    if (this.character?.weakness?.statAffecting === statName) {
      finalValue -= this.character.weakness.statValue || 1;
    }

    // Calculate modifier based on your stat system (0-6 range)
    // Assuming 3 is average/neutral (0 modifier)
    const modifier = finalValue - 3;
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  _statToIterable(): number[] {
    return Array(6)
      .fill(0)
      .map((_, i) => i);
  }

  isStatButtonFilled(index: number, statName: keyof Stats): boolean {
    const currentValue = this.getStatValue(statName);
    return index < currentValue;
  }

  isAbilityButton(index: number, statName: keyof Stats): boolean {
    const currentValue = this.getStatValue(statName);
    return (
      this.character?.ability?.statAffecting === statName &&
      index === currentValue &&
      currentValue < 6
    );
  }

  isWeaknessButton(index: number, statName: keyof Stats): boolean {
    const currentValue = this.getStatValue(statName);
    return (
      this.character?.weakness?.statAffecting === statName &&
      index === currentValue - 1 &&
      currentValue > 0
    );
  }

  getButtonIcon(index: number, statName: keyof Stats): string {
    if (this.isAbilityButton(index, statName)) {
      return 'add';
    }
    if (this.isWeaknessButton(index, statName)) {
      return 'remove';
    }
    return this.isStatButtonFilled(index, statName)
      ? 'circle'
      : 'radio_button_unchecked';
  }

  onStatButtonClick(index: number, statName: keyof Stats): void {
    const newValue = index + 1;
    this.statChanged.emit({ stat: statName, value: newValue });
  }
}
