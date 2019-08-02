import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { MediaService } from 'ngx-responsive-image';
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
    private breakpointObserver: BreakpointObserver
  ) {}
}
