import { ObserversModule } from '@angular/cdk/observers';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { BREAKPOINTS } from './breakpoints.token';
import { IMAGE_WIDTHS } from './image-widths.token';
import { MediaService } from './media/media.service';
import { ResponsiveImageDirective } from './responsive-image/responsive-image.directive';

@NgModule({
  declarations: [ResponsiveImageDirective],
  imports: [ObserversModule, CommonModule],
  exports: [ResponsiveImageDirective]
})
export class NgxResponsiveImageModule {
  static forRoot(
    breakpoints: string[],
    imageWidths: number[]
  ): ModuleWithProviders {
    return {
      ngModule: NgxResponsiveImageModule,
      providers: [
        {
          provide: BREAKPOINTS,
          useValue: breakpoints
        },
        {
          provide: IMAGE_WIDTHS,
          useValue: imageWidths
        },
        MediaService
      ]
    };
  }
}
