import {
  Component,
  ViewChild,
  ViewChildren,
  AfterViewInit,
  OnDestroy,
  QueryList,
  ElementRef,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import {
  Character,
  Stats,
} from '../character-details/character-details.component';
import { characterList } from './characterData';
import { FastAverageColor } from 'fast-average-color';

import { SortType } from '../sort-bar/sort-bar.component';
import { CharacterSelectionService } from '../services/character-selection.service';
import { SortStateService } from '../services/sort-state.service';

@Component({
  selector: 'app-art-lineup',
  standalone: true,
  imports: [],
  templateUrl: './art-lineup.component.html',
  styleUrl: './art-lineup.component.scss',
})
export class ArtLineupComponent implements AfterViewInit, OnDestroy {
  @ViewChild('lineup') lineup?: ElementRef<HTMLDivElement>;
  @ViewChildren('line') lines?: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('imgContainer') imgContainers?: QueryList<
    ElementRef<HTMLDivElement>
  >;
  @ViewChildren('img') imgs?: QueryList<ElementRef<HTMLImageElement>>;

  @Output() characterClicked = new EventEmitter<Character>();

  _originalCharacterList: Character[] = characterList;
  displayedCharacterList: Character[] = [...this._originalCharacterList];
  _colorMap: Record<string, string> = {};

  // Track focused character for touch devices
  private _focusedCharacterIndex: number | null = null;

  // Cache for calculated heights to avoid recalculation during change detection
  private _heightCache = new Map<string, string>();
  // Cache for lineup width to avoid DOM measurement during change detection
  private _lineupWidth = '100%';
  private _widthUpdatePending = false;
  private _sortTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private cdr: ChangeDetectorRef,
    private characterSelectionService: CharacterSelectionService,
    private sortStateService: SortStateService,
  ) {}

  ngAfterViewInit() {
    this._updateLineColors();
    this._precalculateHeights();
    this._updateLineupWidth();

    // Restore sort state first, then focus state
    this._restoreSortAndFocus();
  }

  ngOnDestroy() {
    if (this._sortTimeout) {
      clearTimeout(this._sortTimeout);
    }
  }

  private _restoreSortAndFocus() {
    // First restore the sort state
    const sortState = this.sortStateService.sortState;

    // Use setTimeout to avoid change detection conflicts
    setTimeout(() => {
      // Apply the sort state if it exists
      if (sortState) {
        this._performSort(sortState, true); // Pass true to preserve selection
      }

      // Then restore focus after sorting is complete - increased timeout for complex sorts
      setTimeout(() => {
        this._restoreFocusFromSelection();
      }, 100);
    }, 0);
  }

  private _restoreFocusFromSelection() {
    const selectedCharacter = this.characterSelectionService.selectedCharacter;

    if (selectedCharacter) {
      // Find the index of the selected character in the displayed list
      // Use a more robust matching approach
      const focusIndex = this.displayedCharacterList.findIndex(
        (char) =>
          char.name === selectedCharacter.name &&
          char.age === selectedCharacter.age &&
          char.height === selectedCharacter.height,
      );

      if (focusIndex !== -1) {
        // Set the internal focus state without notifying the service (to avoid loops)
        this._focusedCharacterIndex = focusIndex;

        // Apply the visual focus state after a brief delay to ensure DOM is ready
        setTimeout(() => {
          this._applyVisualFocusState(focusIndex);
          this._scrollToFocusedCharacter(focusIndex);
        }, 150); // Increased timeout
      } else {
        // Character might be filtered out (e.g., N/A stats with "Hide N/A" enabled)
        // Clear the selection since the character is no longer visible
        this.characterSelectionService.clearSelection();
      }
    }
  }

  private _applyVisualFocusState(focusIdx: number) {
    this.imgContainers?.forEach((imgDiv, idx) => {
      if (idx !== focusIdx) {
        imgDiv.nativeElement.classList.add('not-hovered');
      } else {
        imgDiv.nativeElement.classList.remove('not-hovered');
        this.lines?.get(idx)?.nativeElement.classList.add('focus-line');
      }
    });
  }

  private _scrollToFocusedCharacter(focusIdx: number) {
    // Get the focused character's image container
    const focusedContainer = this.imgContainers?.get(focusIdx);
    if (!focusedContainer) {
      console.log('No focused container found');
      return;
    }

    const element = focusedContainer.nativeElement;

    // Find the scrollable parent container - look for the mobile layout's lineup-section
    let scrollableContainer = element.parentElement;
    while (scrollableContainer) {
      const computedStyle = window.getComputedStyle(scrollableContainer);
      if (
        computedStyle.overflowX === 'auto' ||
        computedStyle.overflowX === 'scroll'
      ) {
        break;
      }
      scrollableContainer = scrollableContainer.parentElement;
    }

    if (!scrollableContainer) {
      console.log('No scrollable container found');
      return;
    }

    console.log('Attempting to scroll to character at index:', focusIdx);
    console.log('Element offsetLeft:', element.offsetLeft);
    console.log(
      'Scrollable container scrollLeft before:',
      scrollableContainer.scrollLeft,
    );
    console.log(
      'Scrollable container scrollWidth:',
      scrollableContainer.scrollWidth,
    );
    console.log(
      'Scrollable container clientWidth:',
      scrollableContainer.clientWidth,
    );

    // Calculate the position to scroll to
    const containerRect = scrollableContainer.getBoundingClientRect();

    // Calculate how much to scroll to center the character in view
    const containerWidth = containerRect.width;
    const elementLeftRelativeToContainer =
      element.offsetLeft - scrollableContainer.offsetLeft;
    const elementWidth = element.offsetWidth;

    // Center the character in the viewport
    const targetScrollLeft =
      elementLeftRelativeToContainer - containerWidth / 2 + elementWidth / 2;

    // Ensure we don't scroll beyond the bounds
    const maxScroll =
      scrollableContainer.scrollWidth - scrollableContainer.clientWidth;
    const clampedScrollLeft = Math.max(
      0,
      Math.min(targetScrollLeft, maxScroll),
    );

    console.log(
      'Target scroll position:',
      targetScrollLeft,
      'clamped:',
      clampedScrollLeft,
    );

    // Scroll the container
    scrollableContainer.scrollTo({
      left: clampedScrollLeft,
      behavior: 'smooth',
    });

    // Verify the scroll worked
    setTimeout(() => {
      console.log(
        'Scrollable container scrollLeft after scrollTo:',
        scrollableContainer!.scrollLeft,
      );
    }, 100);
  }

  private _precalculateHeights() {
    this._heightCache.clear();
    this.displayedCharacterList.forEach((character, index) => {
      const defactoHeight = character._adjustedHeightBasis;
      const height = defactoHeight ? defactoHeight + '%' : '30%';
      // Use the same unique key as trackByCharacterName to handle duplicate names
      const uniqueKey = `${character.name}_${index}`;
      this._heightCache.set(uniqueKey, height);
    });
  }

  private _updateLineupWidth() {
    if (this._widthUpdatePending) {
      console.log('Width update already pending, skipping');
      return;
    }

    this._widthUpdatePending = true;
    console.log('updateLineupWidth called');

    // Update the lineup width safely after DOM is ready
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (this.lineup?.nativeElement) {
          const element = this.lineup.nativeElement;
          const scrollWidth = element.scrollWidth;
          const offsetWidth = element.offsetWidth;
          const clientWidth = element.clientWidth;
          console.log(
            `Measured lineup - scrollWidth: ${scrollWidth}px, offsetWidth: ${offsetWidth}px, clientWidth: ${clientWidth}px`,
          );
          console.log('Element children count:', element.children.length);
          console.log(
            'Element computed style width:',
            window.getComputedStyle(element).width,
          );

          // Use the largest reasonable width measurement
          const width = Math.max(scrollWidth, offsetWidth, clientWidth);

          // Only update if we get a reasonable width
          if (width > 0 && width !== 80) {
            // 80px is clearly wrong for a lineup
            this._lineupWidth = width + 'px';
            console.log('Updated lineup width:', this._lineupWidth);
          } else {
            console.warn(
              `Width ${width}px seems incorrect (80px is container width), keeping previous value:`,
              this._lineupWidth,
            );
          }
          this.cdr.detectChanges();
        }
        this._widthUpdatePending = false;
      }, 50);
    });
  }

  protected _adjustedRatioHeight(character: Character, index: number): string {
    // Return cached value to prevent change detection issues
    const uniqueKey = `${character.name}_${index}`;
    return this._heightCache.get(uniqueKey) || '30%';
  }

  protected _getLineupWidth(): string {
    // Return cached width to prevent DOM measurement during change detection
    return this._lineupWidth;
  }

  trackByCharacterName(index: number, character: Character): string {
    // Use a combination of name and index to ensure uniqueness
    // This handles cases where character names might be duplicate or sanitized to "[REDACTED]"
    return `${character.name}_${index}`;
  }

  _updateLineColors() {
    this.imgs?.forEach(async (img, idx) => {
      if (this.lines!.get(idx)) {
        this._colorMap[this.displayedCharacterList[idx].name] =
          await this._getAvgColor(img.nativeElement);
      }
    });
  }

  _getAvgColor(img: HTMLImageElement) {
    const fac = new FastAverageColor();
    return fac
      .getColorAsync(img, {
        algorithm: 'dominant',
        ignoredColor: [
          [255, 255, 255, 255, 100],
          [0, 0, 0, 255],
          [0, 0, 0, 0],
          [255, 255, 0, 255, 5],
        ],
      })
      .then((color) => {
        return color.rgba;
      })
      .catch((e) => {
        console.log(e);
        return '';
      });
  }
  onImgLeave() {
    // If there's a focused character, restore its focus state; otherwise clear all
    if (this._focusedCharacterIndex !== null) {
      this._setFocusState(this._focusedCharacterIndex);
    } else {
      this.imgContainers?.forEach((imgDiv, idx) => {
        imgDiv.nativeElement.classList.remove('not-hovered');
        this.lines?.get(idx)?.nativeElement.classList.remove('focus-line');
      });
    }
  }

  onImgHover(hoverIdx: number) {
    // Always apply hover state, regardless of focus state
    this.imgContainers?.forEach((imgDiv, idx) => {
      if (idx !== hoverIdx) {
        imgDiv.nativeElement.classList.add('not-hovered');
      } else {
        imgDiv.nativeElement.classList.remove('not-hovered');
        this.lines?.get(idx)?.nativeElement.classList.add('focus-line');
      }
    });
  }

  onCharacterClick(character: Character, index: number) {
    // Toggle focus state for touch devices
    if (this._focusedCharacterIndex === index) {
      // Clicking the same character unfocuses it
      this._clearFocusState();
    } else {
      // Focus on the clicked character
      this._setFocusState(index);
    }

    this.characterClicked.emit(character);
  }

  private _setFocusState(focusIdx: number) {
    this._focusedCharacterIndex = focusIdx;

    // Notify the selection service with the focused character
    const focusedCharacter = this.displayedCharacterList[focusIdx];
    this.characterSelectionService.selectCharacter(focusedCharacter);

    // Apply the visual focus state
    this._applyVisualFocusState(focusIdx);
  }
  private _clearFocusState() {
    this._focusedCharacterIndex = null;

    // Clear the selection service
    this.characterSelectionService.clearSelection();

    this._clearVisualFocusState();
  }

  private _clearVisualFocusState() {
    this.imgContainers?.forEach((imgDiv, idx) => {
      imgDiv.nativeElement.classList.remove('not-hovered');
      this.lines?.get(idx)?.nativeElement.classList.remove('focus-line');
    });
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
    // Store the sort state for persistence
    this.sortStateService.updateSortState(event);

    // Clear any existing timeout to debounce rapid sort calls
    if (this._sortTimeout) {
      clearTimeout(this._sortTimeout);
    }

    this._sortTimeout = setTimeout(() => {
      this._performSort(event);
    }, 50); // 50ms debounce
  }

  private _performSort(
    event: {
      sortType: SortType | null;
      sortStat: keyof Stats | null;
      hideNAChars: boolean | null;
    },
    preserveSelection = false,
  ) {
    try {
      // Clear focus state when sorting since indices will change
      if (preserveSelection) {
        // Only clear visual state, preserve selection for restoration
        this._clearVisualFocusState();
        this._focusedCharacterIndex = null;
      } else {
        // Clear everything including selection service
        this._clearFocusState();
      }
      let subList = [...this._originalCharacterList];

      if (event.sortType === SortType.STAT) {
        if (event.sortStat !== null) {
          if (event.hideNAChars) {
            subList = subList.filter((f) => f.stats[event.sortStat!]);
          }
          subList = subList.sort((a, b) => {
            const aVal = this._calculateStatFinal(a, event.sortStat!) || 0;
            const bVal = this._calculateStatFinal(b, event.sortStat!) || 0;
            return aVal - bVal;
          });
        } else {
          console.error('null sortStat when sorting by stat...');
        }
      } else {
        switch (event.sortType) {
          case SortType.HEIGHT:
            if (event.hideNAChars) {
              subList = subList.filter((f) => f.height);
            }
            subList = subList.sort((a, b) => {
              const aVal = a.height || 0;
              const bVal = b.height || 0;
              return aVal - bVal;
            });
            break;
          case SortType.RANK:
            if (event.hideNAChars) {
              subList = subList.filter((f) => f.rank);
            }
            subList = subList.sort((a, b) => {
              const aVal = a.rank || 0;
              const bVal = b.rank || 0;
              return aVal - bVal;
            });
            break;
          case SortType.SENIORITY:
            if (event.hideNAChars) {
              subList = subList.filter((f) => f.serviceYrs);
            }
            subList = subList.sort((a, b) => {
              const aVal = a.serviceYrs || 0;
              const bVal = b.serviceYrs || 0;
              return aVal - bVal;
            });
            break;
          case SortType.AGE:
            if (event.hideNAChars) {
              subList = subList.filter((f) => f.age);
            }
            subList = subList.sort((a, b) => {
              const aVal = a.age || 0;
              const bVal = b.age || 0;
              return aVal - bVal;
            });
            break;
          case SortType.NAME:
            if (event.hideNAChars) {
              subList = subList.filter((f) => f.name);
            }
            subList = subList.sort((a, b) => {
              const aName = a.name || '';
              const bName = b.name || '';
              return aName.localeCompare(bName);
            });
            break;
          default:
            break;
        }
      }

      const validHeights = subList.map((f) => f.height).filter((h) => h > 0);
      const maxHeight =
        validHeights.length > 0 ? Math.max(...validHeights) : 100;

      subList = subList.map((f) => {
        const characterHeight = f.height > 0 ? f.height : maxHeight;
        const heightDim = (characterHeight / maxHeight) * 100;
        // Preserve all properties and only update the height basis
        return {
          ...f,
          _adjustedHeightBasis: heightDim,
        };
      });
      this.displayedCharacterList = subList;

      // Recalculate height cache after sorting
      this._precalculateHeights();
      this._updateLineupWidth();

      // Schedule change detection for next cycle to avoid NG0100
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    } catch (error) {
      console.error('Error during sort operation:', error);
      // Fallback - just update displayed list without sorting
      this.displayedCharacterList = [...this._originalCharacterList];
      this.cdr.detectChanges();
    }
  }
}
