import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';

import { AddressUpdateRoutingModule } from './address-update-routing.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [ AddressUpdateRoutingModule.components ],
  imports: [
    CommonModule,
    AddressUpdateRoutingModule,
    ReactiveFormsModule,
    NgxCaptchaModule,
    HttpClientModule
  ]
})
export class AddressUpdateModule { }
