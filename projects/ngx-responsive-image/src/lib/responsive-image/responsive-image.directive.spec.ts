import { Breakpoints } from '@angular/cdk/layout';
import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BREAKPOINTS } from '../breakpoints.token';
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
        MediaService
      ],
      imports: [CommonModule, ObserversModule]
    });
  });

  it('should replace set the img.src attribute the imgSrc with the target element width', async(() => {
    const imgSrc = 'http://localhost:4000/cdn/banner/:width';
    // tslint:disable-next-line: max-line-length
    const template = `<div #imgContainer [ngStyle]="{'width.px': width}"><img imgSrc="${imgSrc}" [responsiveImage]="imgContainer" ></div>`;

    fixture = createTestComponent(template);
    fixture.componentInstance.width = 400;
    fixture.detectChanges();

    const imgElement = fixture.debugElement.query(By.css('img'));

    expect(imgElement.nativeElement.getAttribute('src')).toBe(
      imgSrc.replace(':width', '400')
    );
  }));
});
