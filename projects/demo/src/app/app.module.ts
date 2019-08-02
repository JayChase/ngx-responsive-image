import { ObserversModule } from '@angular/cdk/observers';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import {
  DEFAULT_BREAKPOINTS,
  DEFAULT_WIDTHS,
  NgxResponsiveImageModule
} from 'ngx-responsive-image';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    MatButtonModule,
    MatCardModule,
    MatListModule,
    ObserversModule,
    NgxResponsiveImageModule.forRoot(DEFAULT_BREAKPOINTS, DEFAULT_WIDTHS)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
