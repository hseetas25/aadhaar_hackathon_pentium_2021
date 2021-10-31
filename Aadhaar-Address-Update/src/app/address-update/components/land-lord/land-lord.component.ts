import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptcha2Component } from 'ngx-captcha';
import { v4 as uuidv4 } from 'uuid';
import { OtpServiceService } from '../../services/otp-service.service';
import { ToastrService } from 'ngx-toastr';


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
          ]
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
    
      public theme: 'light' | 'dark' = 'light';
      public size: 'compact' | 'normal' = 'normal';
      public lang = 'en';
      public type: 'image' | 'audio';
  isDataPresent: boolean = false;
  userData: any= [];
  isLoggedIn: boolean;
    txnID: any;
  
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private firestore: AngularFirestore,
        private otpService: OtpServiceService,
        private toastr: ToastrService
        ) {
            this.isFormSubmitted = false;
            this.isRequestInProgress = false;
            this.isNumberSubmitted = false;
            this.isOtpSent = false;
            this.isLoggedIn = false;
            this.loggedIn();
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
    this.txnID = uuidv4();
    localStorage.setItem('txnId', this.txnID);
    var finalBody = {
        "uid": this.landLordLoginForm.value.aadhaarNumber,
        "txnId": this.txnID
    }
    if (!this.landLordLoginForm.valid) {
        return;
    }
    if (this.landLordLoginForm.valid) {
        this.otpService.getOtp(finalBody).subscribe((data) => {
            console.log(data);
        })
        this.landLordLoginForm.controls['aadhaarNumber'].disable();
        this.otpForm.controls['otp'].enable();
    }
  }

  submitLandLordLoginForm(): void {
    this.isFormSubmitted = true;
    if (!this.otpForm.valid) {
        return;
    }
    if (this.otpForm.valid) {
        window.localStorage.setItem('user', this.landLordLoginForm.value.aadhaarNumber);
        window.localStorage.setItem('otp', this.otpForm.value.otp);
        this.otpForm.controls['otp'].disable();
        var authBody = {
            "uid": localStorage.getItem('user'),
            "txnId": localStorage.getItem('txnId'),
            "otp": localStorage.getItem('otp')
        }
        console.log(authBody);
        this.otpService.authOtp(authBody).subscribe((data) => {
            console.log(data);
            if(data.status == 'Y' || data.status == 'y') {
                window.localStorage.setItem('logged', "true");
                this.toastr.success("Successful", "Login");
            }
            else {
                this.toastr.warning("Invalid", "OTP");
            }
        })
        window.location.reload();
    }
  }
  requests(): void {
      this.firestore.collection(`tenant-requests`).stateChanges().subscribe((data)=>{
        if(data && data.length > 0){
          this.isDataPresent = true;
          data.forEach(element => {
            const temp = element.payload.doc.data();
            if(temp['landLordNumber']==localStorage.getItem('user')) {
              this.userData.push(temp);
            }
          });
        }
      })
  }

  resetLoginForm(): void {
      window.location.reload();
  }

  handleSuccess(data): void {
    //console.log(data);
  }

  logout(): void {
    window.localStorage.clear();
    window.location.reload();
  }

  loggedIn(): void {
    if (localStorage.getItem('user')) {
      this.isLoggedIn = true;
    }
  }

  async acceptRequest(data: any): Promise<void> {
    const id: string = 'tenant-requests/'+data.tenantAadhaarNumber.toString();
    data.request = 'Accepted';
    this.firestore.doc(id).update(data);
    await this.delay(2000);
    window.location.reload();
  }

  async rejectRequest(data: any): Promise<void> {
    const id: string = 'tenant-requests/'+data.tenantAadhaarNumber.toString();
    data.request = 'Rejected';
    this.firestore.doc(id).update(data);
    await this.delay(500);
    window.location.reload();
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

}


