import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Character, FormGrpControls } from '../character-details.component';

interface RankDropdownItem {
  value: string;
  label: string;
}

@Component({
  selector: 'app-character-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: './character-info.component.html',
  styleUrl: './character-info.component.scss',
})
export class CharacterInfoComponent implements OnInit, OnChanges {
  @Input() character: Character | null = null;
  @Input() rankDropdownItems: RankDropdownItem[] = [];

  characterInfoFormGroup!: FormGroup<FormGrpControls<Character>>;

  ngOnInit() {
    if (this.character) {
      this.initializeForm(this.character);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['character'] && changes['character'].currentValue) {
      if (this.characterInfoFormGroup) {
        // Update existing form
        this.updateForm(changes['character'].currentValue);
      } else {
        // Initialize form if it doesn't exist yet
        this.initializeForm(changes['character'].currentValue);
      }
    }
  }

  private initializeForm(character: Character) {
    this.characterInfoFormGroup = new FormGroup({
      name: new FormControl(character.name),
      description: new FormControl(character.description),
      ability: new FormControl(character.ability?.name || ''),
      weakness: new FormControl(character.weakness?.name || ''),
      stats: new FormControl(character.stats),
      age: new FormControl(character.age),
      height: new FormControl(character.height),
      rank: new FormControl(character.rank),
      serviceYrs: new FormControl(character.serviceYrs),
      isActiveService: new FormControl(character.isActiveService),
      generation: new FormControl(character.generation),
      age_detailed: new FormControl(character.age_detailed),
      adjustedImgScalePct: new FormControl(character.adjustedImgScalePct),
      adjustedImgLeftOffsetPct: new FormControl(
        character.adjustedImgLeftOffsetPct,
      ),
      img: new FormControl(character.img),
      _adjustedHeightBasis: new FormControl(character._adjustedHeightBasis),
    });
  }

  private updateForm(character: Character) {
    this.characterInfoFormGroup.patchValue({
      name: character.name,
      description: character.description,
      ability: character.ability?.name || '',
      weakness: character.weakness?.name || '',
      stats: character.stats,
      age: character.age,
      height: character.height,
      rank: character.rank,
      serviceYrs: character.serviceYrs,
      isActiveService: character.isActiveService,
      generation: character.generation,
      age_detailed: character.age_detailed,
      adjustedImgScalePct: character.adjustedImgScalePct,
      adjustedImgLeftOffsetPct: character.adjustedImgLeftOffsetPct,
      img: character.img,
      _adjustedHeightBasis: character._adjustedHeightBasis,
    });
  }

  onImgScaleChange() {
    this.character!.adjustedImgScalePct =
      this.characterInfoFormGroup.value.adjustedImgScalePct;
  }
}
