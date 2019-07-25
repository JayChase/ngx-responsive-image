import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ObserversModule } from '@angular/cdk/observers';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { first, skip, take } from 'rxjs/operators';
import { MediaService } from './media.service';

describe('MediaService', () => {
  const testBreakpoints = ['test', 'test1', 'test2'];
  const testWidths = [200, 400, 600];
  it('should be created', () => {
    TestBed.configureTestingModule({
      imports: [ObserversModule],
      providers: [
        {
          provide: MediaService,
          useFactory: (breakpointObserver: BreakpointObserver) =>
            new MediaService(breakpointObserver, testBreakpoints, testWidths),
          deps: [BreakpointObserver]
        }
      ]
    });
    const service: MediaService = TestBed.get(MediaService);
    expect(service).toBeTruthy();
  });

  describe('breakpointChange$', async () => {
    const breakpointChanges = new Subject<BreakpointState>();
    const mockBreakpointObserver = {
      observe: (value: string | string[]) => breakpointChanges.asObservable()
    };

    beforeEach(() =>
      TestBed.configureTestingModule({
        providers: [
          {
            provide: BreakpointObserver,
            useValue: mockBreakpointObserver
          },
          {
            provide: MediaService,
            useFactory: (breakpointObserver: BreakpointObserver) =>
              new MediaService(breakpointObserver, testBreakpoints, testWidths),
            deps: [BreakpointObserver]
          }
        ]
      })
    );

    it('should start emitting null for previous', done => {
      const service: MediaService = TestBed.get(MediaService);

      service.breakpointChange$
        .pipe(first())
        .subscribe(([previous, current]) => {
          expect(previous).toBeNull();
          done();
        });

      breakpointChanges.next({
        matches: true,
        breakpoints: {
          test: true
        }
      });
    });

    it('should start emitting with current breakpoint as current', done => {
      const service: MediaService = TestBed.get(MediaService);
      const test = {
        matches: true,
        breakpoints: {
          test: true
        }
      };
      service.breakpointChange$
        .pipe(first())
        .subscribe(([previous, current]) => {
          expect(current).toBe(test);
          done();
        });

      breakpointChanges.next(test);
    });

    it('should emit the last breakpoint as previous', done => {
      const service: MediaService = TestBed.get(MediaService);
      const test = {
        matches: true,
        breakpoints: {
          test: true,
          test1: false
        }
      };
      const test1 = {
        matches: true,
        breakpoints: {
          test: false,
          test1: true
        }
      };
      service.breakpointChange$
        .pipe(
          skip(1),
          take(1)
        )
        .subscribe(([previous, current]) => {
          expect(previous).toBe(test);
          done();
        });

      breakpointChanges.next(test);
      breakpointChanges.next(test1);
    });

    it('should only emit breakpoints with distinct breakpoint matches', done => {
      const service: MediaService = TestBed.get(MediaService);
      const test = {
        matches: true,
        breakpoints: {
          test: true,
          test1: false
        }
      };
      const test1 = {
        matches: true,
        breakpoints: {
          test: true,
          test1: false
        }
      };
      const test2 = {
        matches: true,
        breakpoints: {
          test: false,
          test1: true
        }
      };

      service.breakpointChange$
        .pipe(
          skip(1),
          take(1)
        )
        .subscribe(([previous, current]) => {
          expect(current).toBe(test2);
          done();
        });

      breakpointChanges.next(test);
      breakpointChanges.next(test1);
      breakpointChanges.next(test2);
    });
  });

  describe('breakpointUp$', () => {
    const breakpointChanges = new Subject<BreakpointState>();
    const mockBreakpointObserver = {
      observe: (value: string | string[]) => breakpointChanges.asObservable()
    };

    beforeEach(() =>
      TestBed.configureTestingModule({
        providers: [
          {
            provide: BreakpointObserver,
            useValue: mockBreakpointObserver
          },
          {
            provide: MediaService,
            useFactory: (breakpointObserver: BreakpointObserver) =>
              new MediaService(breakpointObserver, testBreakpoints, testWidths),
            deps: [BreakpointObserver]
          }
        ]
      })
    );

    it('should only emit when breakpoint moves up', done => {
      const service: MediaService = TestBed.get(MediaService);
      const test = {
        matches: true,
        breakpoints: {
          test: false,
          test1: true,
          test2: false
        }
      };
      const test1 = {
        matches: true,
        breakpoints: {
          test: true,
          test1: false,
          test2: false
        }
      };
      const test2 = {
        matches: true,
        breakpoints: {
          test: false,
          test1: false,
          test2: true
        }
      };

      service.breakpointUp$
        .pipe(
          skip(1),
          take(1)
        )
        .subscribe(breakpoint => {
          expect(breakpoint).toBe('test2');
          done();
        });

      breakpointChanges.next(test);
      breakpointChanges.next(test1);
      breakpointChanges.next(test2);
    });

    it('should only emit when the current breakpoint is larger than the maximum', done => {
      const service: MediaService = TestBed.get(MediaService);
      const test = {
        matches: true,
        breakpoints: {
          test: false,
          test1: true,
          test2: false
        }
      };
      const test1 = {
        matches: true,
        breakpoints: {
          test: true,
          test1: false,
          test2: false
        }
      };
      const test2 = {
        matches: true,
        breakpoints: {
          test: false,
          test1: false,
          test2: true
        }
      };

      service.breakpointUp$
        .pipe(
          skip(1),
          take(1)
        )
        .subscribe(breakpoint => {
          expect(breakpoint).toBe('test2');
          done();
        });

      breakpointChanges.next(test);
      breakpointChanges.next(test1);
      breakpointChanges.next(test2);
    });
  });
});
