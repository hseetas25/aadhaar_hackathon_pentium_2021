import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AddressUpdateModule } from './address-update';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent, NavigationComponent } from './navigation-components';
import { environment } from 'src/environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule }  from '@angular/fire/database';


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AddressUpdateModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
