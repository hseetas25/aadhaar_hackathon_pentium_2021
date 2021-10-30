import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ReCaptcha2Component } from 'ngx-captcha';
import { Router } from '@angular/router';

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
  validationMessages = {
    aadhaarNumber: [
      { type: 'required', message: 'Aadhaar Number is required.' },
      { type: 'pattern', message: 'Aadhaar Number is of 12 digits.' }
    ],
    otp: [
      { type: 'required', message: 'Otp is required.' },
      { type: 'pattern', message: 'Otp is of 6 digits.' }
    ],
    recaptcha: [
      { type: 'required', message: 'Captcha Verification is required.'}
    ]
  };

  validationPattern = {
    aadhaarNumber: new RegExp(`[0-9]{12}$`),
    otp: new RegExp(`[0-9]{6}$`)
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
        ) {
            this.isFormSubmitted = false;
            this.isRequestInProgress = false;
            this.isNumberSubmitted = false;
            this.isOtpSent = false;
   }

  ngOnInit(): void {
      this.initializeForm();
      this.submitOtpForm();
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
}
