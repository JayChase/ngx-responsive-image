# ngx responsive image

Load properly sized images in an Angular app using the Angular CDK BreakpointObserver to change image sources on breakpoint changes.

- [properly sized images](https://developers.google.com/web/tools/lighthouse/audits/oversized-images)
- [BreakpointObserver](https://material.angular.io/cdk/layout/overview)

## Install

```bash
npm install --save ngx-responsive-image@latest @angular/cdk@latest
```

## Getting started

Import the **NgxResponsiveImageModule** and the Angular CDK **ObserversModule** to **app.module.ts**.

```typescript
import { ObserversModule } from '@angular/cdk/observers';
import {
  DEFAULT_BREAKPOINTS,
  DEFAULT_WIDTHS,
  NgxResponsiveImageModule
} from 'ngx-responsive-image';

@NgModule({
  declarations: [AppComponent],
  imports: [
    ObserversModule,
    NgxResponsiveImageModule.forRoot(DEFAULT_BREAKPOINTS, DEFAULT_WIDTHS)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

## Making an image responsive

First if the image is on a component in a vhild module import **NgxResponsiveImageModule** into the module (without calling forRoot()).

Add the **responsiveImage** directive to the **img**

```html
<img responsiveImage />
```

If you want a placeholder/default image, which is recommened if you are using Universal set the **src** atributes to the placeholder url.

```html
<img responsiveImage src="assets/images/placeholder.jpg" />
```

Set the **imgSrc** attribute to the CDN url of the image replace the static width value with **:width**

```html
<img
  responsiveImage
  src="assets/images/placeholder.jpg"
  imgSrc="http://imageflare/image1/:width"
/>
```

If you a binding to a component property in that case remember to use **[imgSrc]**

### If you are using custom breakpoints

You can set custom breakpoints when call **NgxResponsiveImageModule.forRoot()** be sure to supply the correpsonding image widths to be used in the same order as the breakpoints.

```typescript
@NgModule({
  declarations: [AppComponent],
  imports: [
    NgxResponsiveImageModule.forRoot(
      [Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape],
      [600, 960]
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
```

### If your url requirements are more complicated than just replacing the width

Set the **manual** attribute to true on the image(s) and use the \*\*brekpointUp
