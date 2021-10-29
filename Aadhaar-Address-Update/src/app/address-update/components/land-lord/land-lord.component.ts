import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptcha2Component } from 'ngx-captcha';

@Component({
  selector: 'app-land-lord',
  templateUrl: './land-lord.component.html',
  styleUrls: ['./land-lord.component.scss']
})
export class LandLordComponent implements OnInit {

    isFormSubmitted: boolean;
    isRequestInProgress: boolean;
    landLordLoginForm: FormGroup;
    otpForm: FormGroup;
    isNumberSubmitted: boolean;
    isOtpSent: boolean;
    validationMessages = {
        aadhaarNumber: [
          { type: 'required', message: 'Aadhaar Number is required.' }
        ],
        otp: [
          { type: 'required', message: 'Otp is required.' }
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
      this.landLordLoginForm = this.formBuilder.group({
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

  requestOtp(): void {
    this.isNumberSubmitted = true;
    if (!this.landLordLoginForm.valid) {
      return;
    }
    if(this.landLordLoginForm.valid) {
      this.landLordLoginForm.controls['aadhaarNumber'].disable();
      this.otpForm.controls['otp'].enable();
    }
  }

  submitLandLordLoginForm(): void {}

  resetLoginForm(): void {
      this.landLordLoginForm.reset();
      this.otpForm.reset();
  }

  handleSuccess(data): void {
    console.log(data);
  }

}


