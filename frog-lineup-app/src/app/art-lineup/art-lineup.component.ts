import {
  Component,
  ViewChildren,
  AfterViewInit,
  QueryList,
  ElementRef,
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

  characterList: Character[] = characterList;

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

  sortCharacters(event: {
    sortType: SortType | null;
    sortStat: keyof Stats | null;
  }) {
    console.log(event);
    if (event.sortType === SortType.STAT) {
      if (event.sortStat !== null) {
        this.characterList.sort((a, b) => {
          return a.stats[event.sortStat!] - b.stats[event.sortStat!];
        });
      } else {
        console.error('null sortStat when sorting by stat...');
      }
    } else {
      this.characterList.sort((a, b) => {
        switch (event.sortType) {
          case SortType.HEIGHT:
            return a.height - b.height;
          case SortType.RANK:
            return a.rank - b.rank;
          case SortType.SENIORITY:
            return a.age - b.age;
          default:
            return 0;
        }
      });
    }
  }
}
