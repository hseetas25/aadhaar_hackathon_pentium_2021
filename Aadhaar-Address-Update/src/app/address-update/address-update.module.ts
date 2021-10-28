import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AddressUpdateRoutingModule } from './address-update-routing.module';


@NgModule({
  declarations: [ AddressUpdateRoutingModule.components ],
  imports: [
    CommonModule,
    AddressUpdateRoutingModule,
    ReactiveFormsModule
  ]
})
export class AddressUpdateModule { }
