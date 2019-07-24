import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxResponsiveImageComponent } from './ngx-responsive-image.component';

describe('NgxResponsiveImageComponent', () => {
  let component: NgxResponsiveImageComponent;
  let fixture: ComponentFixture<NgxResponsiveImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxResponsiveImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxResponsiveImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
