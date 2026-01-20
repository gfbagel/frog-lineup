import {
  AfterViewChecked,
  Directive,
  ElementRef,
  Input,
  NgZone,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appNegativeOffset]',
  standalone: true,
})
export class NegativeOffsetDirective implements AfterViewChecked {
  @Input('appNegativeOffset') target: HTMLElement | undefined;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private zone: NgZone,
  ) {}

  ngAfterViewChecked(): void {
    if (this.target) {
      // Run outside Angular to avoid triggering a new change detection cycle
      // and to prevent ExpressionChangedAfterItHasBeenCheckedError.
      this.zone.runOutsideAngular(() => {
        const offset = this.target!.offsetLeft;
        this.renderer.setStyle(
          this.el.nativeElement,
          'margin-left',
          `-${offset}px`,
        );
      });
    }
  }
}
