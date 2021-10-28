import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BorrowerComponent } from './borrower/borrower.component';
import { HomeComponent } from './home/home.component';
import { LandlordComponent } from './landlord/landlord.component';

const routes: Routes = [
    {path:"", redirectTo:"/home", pathMatch:"full"},
    {path:"home", component:HomeComponent},
    {path:"landlord", component:LandlordComponent},
    {path:"borrower", component:BorrowerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
