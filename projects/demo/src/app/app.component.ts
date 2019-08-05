import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { BreakpointChangeEvent, MediaService } from 'ngx-responsive-image';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dynamic-images';
  isBrowser = isPlatformBrowser(this.platformId);

  breakpoints = [
    Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge
  ];

  currentBreakpoint$ = this.breakpointObserver
    .observe(this.breakpoints)
    .pipe(
      map(
        breakpointState =>
          Object.keys(breakpointState.breakpoints)[
            Object.values(breakpointState.breakpoints).indexOf(true)
          ]
      )
    );

  breakpointUp$ = this.mediaService.breakpointUp$;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private mediaService: MediaService,
    private breakpointObserver: BreakpointObserver,
    private renderer2: Renderer2
  ) {}

  updateImage(event: BreakpointChangeEvent, img: HTMLImageElement) {
    this.renderer2.setAttribute(
      img,
      'src',
      event.imgSrc.replace(':width', event.width.toString())
    );
  }
}
