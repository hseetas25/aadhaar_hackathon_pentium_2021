import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AddressUpdateModule } from './address-update';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, NavigationComponent } from './navigation-components';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AddressUpdateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
