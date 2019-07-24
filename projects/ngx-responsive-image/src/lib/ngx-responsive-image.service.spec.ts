import { TestBed } from '@angular/core/testing';

import { NgxResponsiveImageService } from './ngx-responsive-image.service';

describe('NgxResponsiveImageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxResponsiveImageService = TestBed.get(NgxResponsiveImageService);
    expect(service).toBeTruthy();
  });
});
