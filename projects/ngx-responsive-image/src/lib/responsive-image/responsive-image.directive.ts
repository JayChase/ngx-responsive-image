import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs';
import { MediaService } from '../media/media.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: 'img[responsiveImage]'
})
export class ResponsiveImageDirective implements OnDestroy, OnChanges {
  @Input() imgSrc: string;

  private subscriptions: { [key: string]: Subscription } = {};

  constructor(
    private element: ElementRef<HTMLImageElement>,
    private mediaService: MediaService,
    private renderer2: Renderer2
  ) {}

  ngOnChanges(simpleChange: SimpleChanges) {
    if (this.subscriptions.mediaSubscription) {
      this.subscriptions.mediaSubscription.unsubscribe();
    }

    if (this.imgSrc) {
      this.subscriptions.mediaSubscription = this.mediaService.imageWidth$.subscribe(
        width => {
          this.renderer2.setAttribute(
            this.element.nativeElement,
            'src',
            this.imgSrc.replace(':width', width)
          );
        }
      );
    }
  }

  ngOnDestroy() {
    Object.keys(this.subscriptions).forEach(sk =>
      this.subscriptions[sk].unsubscribe()
    );
  }
}
