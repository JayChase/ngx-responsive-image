import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { BREAKPOINTS } from './breakpoints.token';
import { MediaService } from './media/media.service';
import { ResponsiveImageDirective } from './responsive-image/responsive-image.directive';

@NgModule({
  declarations: [ResponsiveImageDirective],
  imports: [ObserversModule, CommonModule],
  exports: [ResponsiveImageDirective]
})
export class NgxResponsiveImageModule {
  static forRoot(breakpoints: string[]): ModuleWithProviders {
    return {
      ngModule: NgxResponsiveImageModule,
      providers: [
        {
          provide: BREAKPOINTS,
          useValue: breakpoints
        },
        MediaService
      ]
    };
  }
}
