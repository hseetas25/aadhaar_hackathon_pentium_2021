import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ReCaptcha2Component } from 'ngx-captcha';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';
import { xml2json } from 'xml-js'

import { TenantRequestService } from '../../services/tenant-request.service';
import { Tenant } from '../../models';
import { AngularFirestore } from '@angular/fire/firestore';
import { OtpServiceService } from '../../services/otp-service.service';

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
    isReqSent: boolean;
    userData: any = [];
    txnID: string;
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
            { type: 'required', message: 'Captcha Verification is required.' }
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

    public theme: 'light' | 'dark' = 'light';
    public size: 'compact' | 'normal' = 'normal';
    public lang = 'en';
    public type: 'image' | 'audio';
    isDataPresent: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private tenantService: TenantRequestService,
        private firestore: AngularFirestore,
        private otpService: OtpServiceService,
        private toastr: ToastrService
    ) {
        this.isFormSubmitted = false;
        this.isRequestInProgress = false;
        this.isNumberSubmitted = false;
        this.isOtpSent = false;
        this.isLoggedIn = false;
        this.isReqSubmitted = false;
        this.isReqSent = false;
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
        if (!this.otpForm.valid) {
            return;
        }
        if (this.otpForm.valid) {
            window.localStorage.setItem('user', this.tenantLoginForm.value.aadhaarNumber);
            window.localStorage.setItem('otp', this.otpForm.value.otp);
            this.otpForm.controls['otp'].disable();

            var authBody = {
                "uid": localStorage.getItem('user'),
                "txnId": localStorage.getItem('txnId'),
                "otp": localStorage.getItem('otp')
            }

            this.otpService.authOtp(authBody).subscribe((data) => {
                console.log(data);
                if (data.status == 'Y' || data.status == 'y') {
                    window.localStorage.setItem('logged', "true");
                    this.toastr.success("Successful", "Login");
                }
                else {
                    this.toastr.warning("Invalid", "OTP");
                }
            })

            this.otpService.getKyc(authBody).subscribe((data) => {
                console.log(data);
                var xml = data.eKycString;
                var result = xml2json(xml, {compact: true, spaces: 4});
                console.log(result);
            })
            window.location.reload();
        }
    }

    requests(): void {
        const id: string = 'tenant-requests/' + localStorage.getItem('user');
        this.firestore.doc(id).get().subscribe((snapshot) => {
            if (snapshot.data()) {
                this.isDataPresent = true;
                this.userData = snapshot.data();
            }
        })
    }

    resetLoginForm(): void {
        window.location.reload();
    }

    requestOtp(): void {
        this.isNumberSubmitted = true;
        this.txnID = uuidv4();
        localStorage.setItem('txnId', this.txnID);
        var finalBody = {
            "uid": this.tenantLoginForm.value.aadhaarNumber,
            "txnId": this.txnID
        }
        if (!this.tenantLoginForm.valid) {
            return;
        }
        if (this.tenantLoginForm.valid) {
            this.otpService.getOtp(finalBody).subscribe((data) => {
                console.log(data);
            })
            this.tenantLoginForm.controls['aadhaarNumber'].disable();
            this.otpForm.controls['otp'].enable();
        }
    }

    handleSuccess(data): void {
        //console.log(data);
    }

    loggedIn(): void {
        if (localStorage.getItem('logged') == "true") {
            this.isLoggedIn = true;
        }
    }

    requestForm(): void {
        this.reqTenantForm = this.formBuilder.group({
            landLordNumber: new FormControl(
                '', [Validators.required, Validators.pattern(this.validationPattern.phNumber)]
            )
        })
    }

    submitReqTenantForm(): void {
        this.isReqSubmitted = true;
        if (!this.reqTenantForm.valid) {
            return;
        }
        if (this.reqTenantForm.valid) {
            this.reqTenantForm.value.tenantAadhaarNumber = localStorage.getItem('user');
            this.tenantService.createRequest(this.reqTenantForm.value as Tenant).subscribe((data) => {
                if (data.isSuccessful) {
                    this.isReqSent = true;
                }
            });
        }
    }

    logout(): void {
        window.localStorage.clear();
        window.location.reload();
    }

}
