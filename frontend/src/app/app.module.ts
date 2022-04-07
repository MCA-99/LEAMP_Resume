import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Cube3dComponent } from './cube3d/cube3d.component';
import { CannonTestComponent } from './cannon-test/cannon-test.component';

@NgModule({
  declarations: [
    AppComponent,
    Cube3dComponent,
    CannonTestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
