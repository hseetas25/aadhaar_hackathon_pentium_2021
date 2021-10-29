import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-land-lord',
  templateUrl: './land-lord.component.html',
  styleUrls: ['./land-lord.component.scss']
})
export class LandLordComponent implements OnInit {

    isFormSubmitted: boolean;
    isRequestInProgress: boolean;
    landLordLoginForm: FormGroup;
    validationMessages = {
        aadhaarNumber: [
          { type: 'required', message: 'Aadhaar Number is required.' }
        ],
        otp: [
          { type: 'required', message: 'Otp is required.' }
        ]
      };
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        ) {
            this.isFormSubmitted = false;
            this.isRequestInProgress = false;
   }

  ngOnInit(): void {
      this.initializeForm();
  }

  initializeForm(): void {
      this.landLordLoginForm = this.formBuilder.group({
          aadhaarNumber: new FormControl(
            '', [Validators.required]
          ),
          otp: new FormControl(
            '', [Validators.required]
          ),
      });
  }

  submitLandLordLoginForm(): void {}

  resetLoginForm(): void {
      this.landLordLoginForm.reset();
  }


}


