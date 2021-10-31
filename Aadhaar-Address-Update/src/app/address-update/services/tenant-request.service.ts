import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { Tenant } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TenantRequestService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  createRequest(data: Tenant): Observable<any> {
    data.request = 'No';
    data.landLordAddress ='';
    const tenantRequestData: Tenant = JSON.parse(JSON.stringify(data)) as Tenant;
    return new Observable((sub) => {
      if (tenantRequestData) {
        const id: string = this.firestore.createId();
        this.firestore.collection(`landlord-requests`).doc(id).set(tenantRequestData).then(() => {
            sub.next({ isSuccessful: true, reason: null });
            this.firestore.collection(`tenant-requests`).doc(tenantRequestData.tenantAadhaarNumber.toString()).set(tenantRequestData);
        }, (reason) => {
          sub.next({ isSuccessful: false, reason: reason.message });
        }).catch((error) => {
          sub.next({ isSuccessful: false, reason: error.message });
        });
      }
      else {
        sub.next({ isSuccessful: false, reason: "Already Placed a Request" });
      }
    });
  }

  getAllActiveNumbers(id: string): Observable<any> {
    return new Observable((sub) => {
      id = id.toString();
      this.firestore.doc('landlord-requests').get().subscribe((snapshot) => {
        if (snapshot.data()) {
          sub.next({isSuccessful: true, data: snapshot.data()});
        } else {
          sub.next({isSuccessful: false, data: null});
        }
      });
    });
  }
}