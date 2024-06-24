import {
  Component,
  ViewChildren,
  AfterViewInit,
  QueryList,
  ElementRef,
} from '@angular/core';
import { Character } from '../character-details/character-details.component';
import { characterList } from './characterData';
import { FastAverageColor } from 'fast-average-color';
import { AsyncPipe } from '@angular/common';

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
  characterList: Character[] = characterList;
}
