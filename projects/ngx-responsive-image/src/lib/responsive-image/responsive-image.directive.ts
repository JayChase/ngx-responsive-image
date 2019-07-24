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
  @Input() responsiveImage: HTMLElement;
  @Input() imgSrc: string;

  private subscriptions: { [key: string]: Subscription } = {};

  constructor(
    private element: ElementRef<HTMLImageElement>,
    private mediaService: MediaService,
    private renderer2: Renderer2
  ) {
    this.subscriptions.mediaSubscription = this.mediaService.breakpointUp$.subscribe(
      result => {
        this.setImgSrc();
      }
    );
  }

  ngOnChanges(simpleChange: SimpleChanges) {
    this.setImgSrc();
  }

  ngOnDestroy() {
    Object.keys(this.subscriptions).forEach(sk =>
      this.subscriptions[sk].unsubscribe()
    );
  }

  private setImgSrc() {
    if (this.imgSrc && this.responsiveImage) {
      this.renderer2.setAttribute(
        this.element.nativeElement,
        'src',
        this.imgSrc.replace(
          ':width',
          this.responsiveImage.offsetWidth.toString()
        )
      );
    }
  }
}
