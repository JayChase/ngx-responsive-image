import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { Component, DebugElement, PLATFORM_ID } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { BREAKPOINTS } from '../breakpoints.token';
import { DEFAULT_BREAKPOINTS } from '../default-breakpoints';
import { DEFAULT_WIDTHS } from '../default-widths';
import { IMAGE_WIDTHS } from '../image-widths.token';
import { MediaService } from '../media/media.service';
import { ResponsiveImageDirective } from './responsive-image.directive';

@Component({ selector: 'nri-test', template: '' })
class TestComponent {
  width: number;
}

function createTestComponent(
  template: string
): ComponentFixture<TestComponent> {
  return TestBed.overrideComponent(TestComponent, {
    set: { template }
  }).createComponent(TestComponent);
}

describe('ResponsiveImageDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  const breakpointAndWidthUpSubject = new Subject<{
    width: number;
    breakpoint: string;
  }>();
  const mockMediaService = {
    breakpointAndWidthUp$: breakpointAndWidthUpSubject.asObservable()
  };

  afterEach(() => {
    fixture = null;
  });

  describe('on server', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, ResponsiveImageDirective],
        providers: [
          {
            provide: PLATFORM_ID,
            useValue: 'server'
          },
          {
            provide: BREAKPOINTS,
            useValue: DEFAULT_BREAKPOINTS
          },
          {
            provide: IMAGE_WIDTHS,
            useValue: DEFAULT_WIDTHS
          },
          {
            provide: MediaService,
            useValue: mockMediaService
          }
        ],
        imports: [CommonModule, ObserversModule]
      });
    });

    it('should not update the img src', () => {
      const imgSrc = 'http://localhost:4000/cdn/banner/:width';
      const src = 'ssr/placeholder';
      // tslint:disable-next-line: max-line-length
      const template = `<img imgSrc="${imgSrc}" src="${src}" [manual]="true" responsiveImage>`;
      const breakpointUp = {
        width: 600,
        breakpoint: 'test-breakpoint'
      };
      fixture = createTestComponent(template);
      fixture.detectChanges();

      breakpointAndWidthUpSubject.next(breakpointUp);

      const imgElement = fixture.debugElement.query(By.css('img'));

      fixture.detectChanges();

      expect(imgElement.nativeElement.getAttribute('src')).toBe(src);
    });
  });

  describe('on browser', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, ResponsiveImageDirective],
        providers: [
          {
            provide: PLATFORM_ID,
            useValue: 'browser'
          },
          {
            provide: BREAKPOINTS,
            useValue: DEFAULT_BREAKPOINTS
          },
          {
            provide: IMAGE_WIDTHS,
            useValue: DEFAULT_WIDTHS
          },
          {
            provide: MediaService,
            useValue: mockMediaService
          }
        ],
        imports: [CommonModule, ObserversModule]
      });
    });

    describe('if manual', () => {
      it('should emit breakpointUp event', done => {
        const imgSrc = 'http://localhost:4000/cdn/banner/:width';
        // tslint:disable-next-line: max-line-length
        const template = `<div><img imgSrc="${imgSrc}" [manual]="true" responsiveImage ></div>`;
        const breakpointUp = {
          width: 600,
          breakpoint: 'test-breakpoint'
        };
        fixture = createTestComponent(template);
        fixture.detectChanges();

        const imgElement = fixture.debugElement.query(By.css('img'));
        const responsiveImageDirective = imgElement.injector.get<
          ResponsiveImageDirective
        >(ResponsiveImageDirective);

        responsiveImageDirective.breakpointUp.subscribe(result => {
          expect(result).toEqual({
            imgSrc,
            breakpoint: breakpointUp.breakpoint,
            width: breakpointUp.width
          });
          done();
        });

        breakpointAndWidthUpSubject.next(breakpointUp);
        fixture.detectChanges();
      });
    });

    describe('if !manual', () => {
      it('should replace set the img.src attribute the imgSrc with the target element width', async(() => {
        const imgSrc = 'http://localhost:4000/cdn/banner/:width';
        // tslint:disable-next-line: max-line-length
        const template = `<div><img imgSrc="${imgSrc}" responsiveImage></div>`;
        const breakpointUp = {
          width: 600,
          breakpoint: 'test-breakpoint'
        };
        fixture = createTestComponent(template);
        fixture.detectChanges();

        breakpointAndWidthUpSubject.next(breakpointUp);

        const imgElement = fixture.debugElement.query(By.css('img'));

        fixture.detectChanges();

        expect(imgElement.nativeElement.getAttribute('src')).toBe(
          imgSrc.replace(':width', '600')
        );
      }));
    });

    describe('if manual', () => {
      const imgSrc = 'http://localhost:4000/cdn/banner/:width';
      // tslint:disable-next-line: max-line-length
      const template = `<div><img imgSrc="${imgSrc}" [manual]="true" responsiveImage></div>`;
      let imgElement: DebugElement;
      let responsiveImageDirective: ResponsiveImageDirective;

      const breakpointUp = {
        width: 600,
        breakpoint: 'test-breakpoint'
      };

      beforeEach(() => {
        fixture = createTestComponent(template);
        fixture.detectChanges();
        imgElement = fixture.debugElement.query(By.css('img'));
        responsiveImageDirective = imgElement.injector.get<
          ResponsiveImageDirective
        >(ResponsiveImageDirective);
      });

      it('should emit an breakpointUp event', done => {
        responsiveImageDirective.breakpointUp
          .asObservable()
          .subscribe(result => {
            expect(result).not.toBeNull();
            done();
          });

        breakpointAndWidthUpSubject.next(breakpointUp);
        fixture.detectChanges();
      });

      it('should emit the breakpoint width', done => {
        responsiveImageDirective.breakpointUp
          .asObservable()
          .subscribe(result => {
            expect(result.width).toEqual(600);
            done();
          });

        breakpointAndWidthUpSubject.next(breakpointUp);
        fixture.detectChanges();
      });

      it('should emit the breakpoint', done => {
        responsiveImageDirective.breakpointUp
          .asObservable()
          .subscribe(result => {
            expect(result.breakpoint).toEqual(breakpointUp.breakpoint);
            done();
          });

        breakpointAndWidthUpSubject.next(breakpointUp);
        fixture.detectChanges();
      });

      it('should emit the imgSrc', done => {
        responsiveImageDirective.breakpointUp
          .asObservable()
          .subscribe(result => {
            expect(result.imgSrc).toEqual(imgSrc);
            done();
          });

        breakpointAndWidthUpSubject.next(breakpointUp);
        fixture.detectChanges();
      });
    });
  });
});
