import {
  Component,
  ViewChildren,
  AfterViewInit,
  QueryList,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  Character,
  Stats,
} from '../character-details/character-details.component';
import { characterList } from './characterData';
import { FastAverageColor } from 'fast-average-color';
import { AsyncPipe } from '@angular/common';
import { SortType } from '../sort-bar/sort-bar.component';

@Component({
  selector: 'app-art-lineup',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './art-lineup.component.html',
  styleUrl: './art-lineup.component.scss',
})
export class ArtLineupComponent implements AfterViewInit {
  @ViewChildren('line') lines?: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('imgContainer') imgContainers?: QueryList<
    ElementRef<HTMLDivElement>
  >;
  @ViewChildren('img') imgs?: QueryList<ElementRef<HTMLImageElement>>;

  @Output() characterClicked = new EventEmitter<Character>();

  _originalCharacterList: Character[] = characterList;
  displayedCharacterList: Character[] = [...this._originalCharacterList];

  ngAfterViewInit() {
    this.imgs?.forEach(async (img, idx) => {
      if (this.lines!.get(idx)) {
        this.lines!.get(idx)!.nativeElement.style.backgroundColor =
          await this._getAvgColor(img.nativeElement);
      }
    });
  }

  _getAvgColor(img: HTMLImageElement) {
    const fac = new FastAverageColor();
    return fac
      .getColorAsync(img)
      .then((color) => {
        return color.rgba;
      })
      .catch((e) => {
        console.log(e);
        return '';
      });
  }
  onImgLeave() {
    this.imgContainers?.forEach((imgDiv, idx) => {
      imgDiv.nativeElement.classList.remove('not-hovered');
      this.lines?.get(idx)?.nativeElement.classList.remove('focus-line');
    });
  }
  onImgHover(hoverIdx: number) {
    this.imgContainers?.forEach((imgDiv, idx) => {
      if (idx !== hoverIdx) {
        imgDiv.nativeElement.classList.add('not-hovered');
      } else {
        this.lines?.get(idx)?.nativeElement.classList.add('focus-line');
      }
    });
  }

  onCharacterClick(character: Character) {
    this.characterClicked.emit(character);
  }

  _calculateStatFinal(character: Character, statToGet: keyof Stats) {
    let baseStatVal = character.stats[statToGet];
    if (character.ability && character.ability.statAffecting === statToGet) {
      baseStatVal += character.ability.statValue;
    }
    if (character.weakness && character.weakness.statAffecting === statToGet) {
      baseStatVal -= character.weakness.statValue;
    }
    return baseStatVal;
  }

  sortCharacters(event: {
    sortType: SortType | null;
    sortStat: keyof Stats | null;
    hideNAChars: boolean | null;
  }) {
    let subList = [...this._originalCharacterList];

    console.log(event);
    if (event.sortType === SortType.STAT) {
      if (event.sortStat !== null) {
        subList = subList.filter((f) => f.stats[event.sortStat!]);
        this.displayedCharacterList = subList.sort((a, b) => {
          return (
            this._calculateStatFinal(a, event.sortStat!) -
            this._calculateStatFinal(b, event.sortStat!)
          );
        });
      } else {
        console.error('null sortStat when sorting by stat...');
      }
    } else {
      switch (event.sortType) {
        case SortType.HEIGHT:
          subList = subList.filter((f) => f.height);
          this.displayedCharacterList = subList.sort((a, b) => {
            return a.height - b.height;
          });
          break;
        case SortType.RANK:
          subList = subList.filter((f) => f.rank);
          this.displayedCharacterList = subList.sort((a, b) => {
            return a.rank - b.rank;
          });
          break;
        case SortType.SENIORITY:
          subList = subList.filter((f) => f.serviceYrs);
          this.displayedCharacterList = subList.sort((a, b) => {
            return a.serviceYrs - b.serviceYrs;
          });
          break;
        case SortType.AGE:
          subList = subList.filter((f) => f.age);
          this.displayedCharacterList = subList.sort((a, b) => {
            return a.age - b.age;
          });
          break;
        case SortType.NAME:
          subList = subList.filter((f) => f.name);
          this.displayedCharacterList = subList.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
          break;
        default:
          break;
      }
    }
  }
}
