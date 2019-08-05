import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaService } from '../media/media.service';
import { BreakpointChangeEvent } from './breakpoint-change-event';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'img[responsiveImage]'
})
export class ResponsiveImageDirective implements OnDestroy, OnChanges {
  @Input() imgSrc: string;
  @Input() manual: boolean;
  @Output() breakpointUp = new EventEmitter<BreakpointChangeEvent>();

  private subscriptions: { [key: string]: Subscription } = {};

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private element: ElementRef<HTMLImageElement>,
    private mediaService: MediaService,
    private renderer2: Renderer2
  ) {}

  ngOnChanges(simpleChange: SimpleChanges) {
    if (isPlatformBrowser(this.platformId)) {
      if (this.subscriptions.mediaSubscription) {
        this.subscriptions.mediaSubscription.unsubscribe();
      }

      if (this.imgSrc) {
        this.subscriptions.mediaSubscription = this.mediaService.breakpointAndWidthUp$.subscribe(
          result => {
            if (this.manual) {
              this.breakpointUp.emit({
                imgSrc: this.imgSrc,
                breakpoint: result.breakpoint,
                width: result.width
              });
            } else {
              this.renderer2.setAttribute(
                this.element.nativeElement,
                'src',
                this.imgSrc.replace(':width', result.width)
              );
            }
          }
        );
      }
    }
  }

  ngOnDestroy() {
    Object.keys(this.subscriptions).forEach(sk =>
      this.subscriptions[sk].unsubscribe()
    );
  }
}
