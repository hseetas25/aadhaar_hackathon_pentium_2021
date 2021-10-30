import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ReCaptcha2Component } from 'ngx-captcha';
import { Router } from '@angular/router';

import { AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';

@Component({
  selector: 'app-borrower',
  templateUrl: './borrower.component.html',
  styleUrls: ['./borrower.component.scss']
})
export class BorrowerComponent implements OnInit {
  isFormSubmitted: boolean;
  isRequestInProgress: boolean;
  tenantLoginForm: FormGroup;
  otpForm: FormGroup;
  isOtpSent: boolean;
  isNumberSubmitted: boolean;
  isLoggedIn: boolean;
  reqTenantForm: FormGroup;
  isReqSubmitted: boolean;
  validationMessages = {
    aadhaarNumber: [
      { type: 'required', message: 'Aadhaar Number is required.' },
      { type: 'pattern', message: 'Aadhaar Number is of 12 digits.' }
    ],
    landLordAadhaar: [
      { type: 'required', message: 'Aadhaar Number is required.' },
      { type: 'pattern', message: 'Aadhaar Number is of 12 digits.' }
    ],
    otp: [
      { type: 'required', message: 'Otp is required.' },
      { type: 'pattern', message: 'Otp is of 6 digits.' }
    ],
    recaptcha: [
      { type: 'required', message: 'Captcha Verification is required.'}
    ],
    landLordNumber: [
      { type: 'required', message: 'Phone Number is required.' },
      { type: 'pattern', message: 'Phone Number is of 10 digits.' }
    ],
  };

  validationPattern = {
    aadhaarNumber: new RegExp(`[0-9]{12}$`),
    otp: new RegExp(`[0-9]{6}$`),
    phNumber: new RegExp(`[0-9]{10}$`),
  };

  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  @ViewChild('langInput') langInput: ElementRef;

  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;

  public theme: 'dark' | 'light' = 'dark';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio';
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private fireBase: AngularFireDatabase
        ) {
            this.isFormSubmitted = false;
            this.isRequestInProgress = false;
            this.isNumberSubmitted = false;
            this.isOtpSent = false;
            this.isLoggedIn = false;
            this.isReqSubmitted = false;
            this.loggedIn();
   }

  ngOnInit(): void {
      this.initializeForm();
      this.submitOtpForm();
      this.requestForm();
  }

  initializeForm(): void {
      this.tenantLoginForm = this.formBuilder.group({
          aadhaarNumber: new FormControl(
            '', [Validators.required, Validators.pattern(this.validationPattern.aadhaarNumber)]
          )
      });
  }

  submitOtpForm(): void {
    this.otpForm = this.formBuilder.group({
      otp: new FormControl(
        '', [Validators.required, Validators.pattern(this.validationPattern.otp)]
      ),
      recaptcha: new FormControl(
        '', [Validators.required]
      )
    });
    this.otpForm.controls['otp'].disable();
  }

  submitTenantLoginForm(): void {
    this.isFormSubmitted = true;
    if(!this.otpForm.valid) {
      return;
    }
    if(this.otpForm.valid) {
      this.otpForm.controls['otp'].disable();
      window.localStorage.setItem('user', 'present');
      window.location.reload();
    }
  }

  resetLoginForm(): void {
    window.location.reload();
}

  requestOtp(): void {
    this.isNumberSubmitted = true;
    if (!this.tenantLoginForm.valid) {
      return;
    }
    if(this.tenantLoginForm.valid) {
      this.tenantLoginForm.controls['aadhaarNumber'].disable();
      this.otpForm.controls['otp'].enable();
    }
  }

  handleSuccess(data): void {
    console.log(data);
  }

  loggedIn(): void {
    if (localStorage.getItem('user') === 'present') {
      console.log(localStorage.getItem('user'));
      this.isLoggedIn = true;
    }
  }

  requestForm(): void {
    this.reqTenantForm = this.formBuilder.group({
      landLordAadhaar: new FormControl(
        '', [Validators.required, Validators.pattern(this.validationPattern.aadhaarNumber)]
      ),
      landLordNumber: new FormControl(
        '', [Validators.required, Validators.pattern(this.validationPattern.phNumber)]
      )
    })
  }

  submitReqTenantForm(): void {
    this.isReqSubmitted = true;
    if(!this.reqTenantForm.valid) {
      return;
    }
    if(this.reqTenantForm.valid) {

    }
  }
}
