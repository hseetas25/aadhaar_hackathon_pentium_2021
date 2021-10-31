import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OtpServiceService {

    constructor(private hc: HttpClient) { }

    getOtp(finalBody:any): Observable<any> {
        return this.hc.post('https://stage1.uidai.gov.in/onlineekyc/getOtp/', finalBody);
    }

    authOtp(authBody:any): Observable<any> {
        return this.hc.post('https://stage1.uidai.gov.in/onlineekyc/getAuth/', authBody);
    }

    getKyc(authBody:any): Observable<any> {
        return this.hc.post('https://stage1.uidai.gov.in/onlineekyc/getEkyc/', authBody);
    }
}
