import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Doctor } from '../models/doctor';
import { Prescription } from '../models/prescription';
import { Slots } from '../models/slots';
import { User } from '../models/user';
import { Department } from '../models/department';
import { tap } from 'rxjs/operators';

const NAV_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  user = new User();
  doctor = new Doctor();

  constructor(private _http : HttpClient) { }

  addDoctorFromRemote(doctor : Doctor) : Observable<any>
  {
      return this._http.post<any>(`${NAV_URL}/addDoctor`,doctor)
  }

  getDoctorList() : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/doctorlist`);
  }

  getSlotList() : Observable<Slots[]>
  {
    return this._http.get<Slots[]>(`${NAV_URL}/slotDetails`);
  }

  getSlotListWithUniqueDoctors() : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/slotDetailsWithUniqueDoctors`);
  }

  getSlotListWithUniqueSpecializations() : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/slotDetailsWithUniqueSpecializations`);
  }

  getSlotDetails(email: string): Observable<Slots[]> {
    return this._http.get<Slots[]>(`${NAV_URL}/admin/doctorSlots/${email}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching slot details:', error);
        if (error.status === 404) {
          return this._http.get<Slots[]>(`${NAV_URL}/slotDetails/${email}`);
        }
        return of([]);
      })
    );
  }

  getDoctorListByEmail(loggedUser : string) : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/doctorlistbyemail/`+loggedUser);
  }

  getPatientListByEmail(email : string) : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/patientlistbyemail/`+email);
  }

 getPatientListByDoctorEmail(loggedUser: string): Observable<any> {
  return this._http.get<any>(`${NAV_URL}/patientlistbydoctoremail/` + loggedUser).pipe(
    tap((data: any) => console.log('Service: Doctor patients:', data))
  );
}

getPatientList(): Observable<any> {
  return this._http.get<any>(`${NAV_URL}/patientlist`).pipe(
    tap((data: any) => console.log('Service: All patients:', data))
  );
}
  getPatientListByDoctorEmailAndDate(loggedUser : string) : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/patientlistbydoctoremailanddate/`+loggedUser);
  }

  public acceptRequestForDoctorApproval(email : string) : Observable<any>
  {
    console.log("accepted");
    return this._http.get<any>(`${NAV_URL}/acceptstatus/`+email);
  }

  public rejectRequestForDoctorApproval(email : string) : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/rejectstatus/`+email)
  }

  public acceptRequestForPatientApproval(slot : string) : Observable<any>
  {
    console.log("accepted");
    return this._http.get<any>(`${NAV_URL}/acceptpatient/`+slot);
  }

  public rejectRequestForPatientApproval(slot : string) : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/rejectpatient/`+slot);
  }

  public addBookingSlots(slot: Slots): Observable<any> {
    // Set default status for new slots (already handled in component, but safe here too)
    slot.amstatus = 'unbooked';
    slot.noonstatus = 'unbooked';
    slot.pmstatus = 'unbooked';
    
    // Key fix: Add responseType: 'text' to accept plain text response from backend
    // Also ensure Content-Type header for JSON body
    const headers = { 'Content-Type': 'application/json' };
    return this._http.post(`${NAV_URL}/addBookingSlots`, slot, { 
      headers: headers,
      responseType: 'text'  // This prevents JSON parsing error on plain text response
    });
  }

  public addPrescriptions(prescription : Prescription) : Observable<any>
  {
    return this._http.post<any>(`${NAV_URL}/addPrescription`,prescription)
  }

  public getProfileDetails(loggedUser : string) : Observable<any>
  {
    return this._http.get(`${NAV_URL}/doctorProfileDetails/`+loggedUser);
  }
  
  public updateDoctorProfile(doctor: Doctor): Observable<Doctor> {
  return this._http.put<Doctor>(`${NAV_URL}/updatedoctor`, doctor);
}

  getDoctorById(id: number): Observable<Doctor> {
    return this._http.get<Doctor>(`${NAV_URL}/doctors/${id}`);
  }

  deleteDoctor(id: number): Observable<any> {
    return this._http.delete(`${NAV_URL}/doctors/${id}`);
  }

  getDoctorSlots(doctorId: number): Observable<any[]> {
    return this._http.get<any[]>(`${NAV_URL}/doctors/${doctorId}/slots`);
  }

  getDoctorAppointments(doctorId: number): Observable<any[]> {
    return this._http.get<any[]>(`${NAV_URL}/doctors/${doctorId}/appointments`);
  }

  getDepartments(): Observable<Department[]> {
    return this._http.get<Department[]>(`${NAV_URL}/departments`);
  }

  addDepartment(department: Department): Observable<Department> {
    return this._http.post<Department>(`${NAV_URL}/departments`, department);
  }

  getAppointmentList(): Observable<any[]> {
    return this._http.get<any[]>(`${NAV_URL}/appointments`);
  }

 addPrescriptionFromRemote(prescription: Prescription): Observable<any> {
  const headers = { 'Content-Type': 'application/json' };
  return this._http.post<any>(`${NAV_URL}/addPrescription`, prescription, { headers });
}

}