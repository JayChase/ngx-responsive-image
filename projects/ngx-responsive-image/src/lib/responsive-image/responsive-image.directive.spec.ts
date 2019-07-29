import { Breakpoints } from '@angular/cdk/layout';
import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { BREAKPOINTS } from '../breakpoints.token';
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, ResponsiveImageDirective],
      providers: [
        {
          provide: BREAKPOINTS,
          useValue: [
            Breakpoints.XSmall,
            Breakpoints.Small,
            Breakpoints.Medium,
            Breakpoints.Large,
            Breakpoints.XLarge
          ]
        },
        {
          provide: IMAGE_WIDTHS,
          useValue: [300, 600, 960, 1280, 1920]
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
});
