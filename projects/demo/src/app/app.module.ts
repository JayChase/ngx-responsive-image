import { Breakpoints } from '@angular/cdk/layout';
import { ObserversModule } from '@angular/cdk/observers';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { NgxResponsiveImageModule } from 'ngx-responsive-image';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    ObserversModule,
    NgxResponsiveImageModule.forRoot([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
