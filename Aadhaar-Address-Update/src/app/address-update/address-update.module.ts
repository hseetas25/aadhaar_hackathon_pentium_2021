import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';

import { AddressUpdateRoutingModule } from './address-update-routing.module';


@NgModule({
  declarations: [ AddressUpdateRoutingModule.components ],
  imports: [
    CommonModule,
    AddressUpdateRoutingModule,
    ReactiveFormsModule,
    NgxCaptchaModule
  ]
})
export class AddressUpdateModule { }
