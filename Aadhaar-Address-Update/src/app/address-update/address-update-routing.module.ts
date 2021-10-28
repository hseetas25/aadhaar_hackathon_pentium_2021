import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { 
  HomeComponent,
  BorrowerComponent,
  LandLordComponent,
  PageNotFoundComponent
} from './components';
const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'borrower', component: BorrowerComponent },
  { path: 'land-lord' , component: LandLordComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddressUpdateRoutingModule {
  static components = [
    HomeComponent,
    BorrowerComponent,
    LandLordComponent,
    PageNotFoundComponent
  ]
 }
