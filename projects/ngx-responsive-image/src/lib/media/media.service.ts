import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Inject, Injectable } from '@angular/core';
import { merge } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  pairwise,
  shareReplay,
  startWith,
  takeWhile
} from 'rxjs/operators';
import { BREAKPOINTS } from '../breakpoints.token';
import { IMAGE_WIDTHS } from '../image-widths.token';

@Injectable()
export class MediaService {
  breakpoints$ = this.breakpointObserver.observe(this.breakpoints);

  breakpointChange$ = this.breakpoints$.pipe(
    filter(breakpointState => breakpointState.matches),
    distinctUntilChanged(
      (previous, current) =>
        Object.keys(previous.breakpoints)[
          Object.values(previous.breakpoints).indexOf(true)
        ] ===
        Object.keys(current.breakpoints)[
          Object.values(current.breakpoints).indexOf(true)
        ]
    ),
    startWith(null as BreakpointState),
    pairwise()
  );

  breakpointUp$ = this.breakpointChange$.pipe(
    filter(([previous, current], i) => {
      if (i === 0) {
        return true;
      } else {
        const previousBreakpoints = Object.values(previous.breakpoints);
        const currentBreakpoints = Object.values(current.breakpoints);
        const pbi = previousBreakpoints.findIndex(
          breakpointValue => breakpointValue
        );
        const cbi = currentBreakpoints.findIndex(
          breakpointValue => breakpointValue
        );
        return cbi > pbi;
      }
    }),
    filter<BreakpointState[]>(([previous, current]) => {
      const currentBkreakpoint = Object.keys(current.breakpoints)[
        Object.values(current.breakpoints).indexOf(true)
      ];

      if (
        !this.maximumBreakpoint ||
        Object.keys(current.breakpoints).indexOf(currentBkreakpoint) >
          Object.keys(current.breakpoints).indexOf(this.maximumBreakpoint)
      ) {
        this.maximumBreakpoint = currentBkreakpoint;
        return true;
      } else {
        return false;
      }
    }),
    map(([previous, current]) => {
      return Object.keys(current.breakpoints)[
        Object.values(current.breakpoints).indexOf(true)
      ];
    }),
    takeWhile(currentBreakpoint => {
      return (
        this.maximumBreakpoint !== this.breakpoints[this.breakpoints.length - 1]
      );
    }, true),
    shareReplay()
  );

  breakpointAndWidthUp$ = merge(
    this.breakpoints$.pipe(
      first(),
      map(
        breakpointState =>
          Object.keys(breakpointState.breakpoints)[
            Object.values(breakpointState.breakpoints).indexOf(true)
          ]
      )
    ),
    this.breakpointUp$
  ).pipe(
    map(breakpoint => {
      return {
        width: this.imageWidths[this.breakpoints.indexOf(breakpoint)],
        breakpoint
      };
    }),
    shareReplay()
  );

  private maximumBreakpoint: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    @Inject(BREAKPOINTS) private breakpoints,
    @Inject(IMAGE_WIDTHS) private imageWidths
  ) {}
}
