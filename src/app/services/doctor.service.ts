import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Doctor } from '../models/doctor';
import { Prescription } from '../models/prescription';
import { Slots } from '../models/slots';
import { User } from '../models/user';
import { Department } from '../models/department';


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
    return this._http.get<Slots[]>(`${NAV_URL}/slotDetails`); // Yeh change: /admin/slotlist se /slotDetails kar, backend match
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
    // Using the admin endpoint for better type safety and consistent naming
    return this._http.get<Slots[]>(`${NAV_URL}/admin/doctorSlots/${email}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching slot details:', error);
        if (error.status === 404) {
          // Fallback to legacy endpoint if admin endpoint not found
          return this._http.get<Slots[]>(`${NAV_URL}/slotDetails/${email}`);
        }
        // Return empty array if both endpoints fail
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

  getPatientList() : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/patientlist`);
  }

  getPatientListByDoctorEmail(loggedUser : string) : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/patientlistbydoctoremail/`+loggedUser);
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
    slot.amstatus = 'unbooked';
    slot.noonstatus = 'unbooked';
    slot.pmstatus = 'unbooked';
    
    return this._http.post<any>(`${NAV_URL}/addBookingSlots`, slot, );
    // { responseType : 'text' }  set up
}

  public addPrescriptions(prescription : Prescription) : Observable<any>
  {
    return this._http.post<any>(`${NAV_URL}/addPrescription`,prescription)
  }

  public getProfileDetails(loggedUser : string) : Observable<any>
  {
    return this._http.get(`${NAV_URL}/doctorProfileDetails/`+loggedUser);
  }
  
  public UpdateDoctorProfile(user:any):Observable<any>
  {
    return this._http.put<any>(`${NAV_URL}/updatedoctor`,user)
  }

  /**
   * Get doctor by ID
   * @param id Doctor ID
   * @returns Observable of Doctor
   */
  getDoctorById(id: number): Observable<Doctor> {
    return this._http.get<Doctor>(`${NAV_URL}/doctors/${id}`);
  }

  /**
   * Delete doctor
   * @param id Doctor ID
   * @returns Observable of any
   */
  deleteDoctor(id: number): Observable<any> {
    return this._http.delete(`${NAV_URL}/doctors/${id}`);
  }

  /**
   * Get doctor's available slots
   * @param doctorId Doctor ID
   * @returns Observable of slots array
   */
  getDoctorSlots(doctorId: number): Observable<any[]> {
    return this._http.get<any[]>(`${NAV_URL}/doctors/${doctorId}/slots`);
  }

  /**
   * Get doctor's appointments
   * @param doctorId Doctor ID
   * @returns Observable of appointments array
   */
  getDoctorAppointments(doctorId: number): Observable<any[]> {
    return this._http.get<any[]>(`${NAV_URL}/doctors/${doctorId}/appointments`);
  }

  /**
   * Get departments
   * @returns Observable of departments array
   */
  getDepartments(): Observable<Department[]> {
    return this._http.get<Department[]>(`${NAV_URL}/departments`);
  }

  /**
   * Add department
   * @param department Department object
   * @returns Observable of created Department
   */
  addDepartment(department: Department): Observable<Department> {
    return this._http.post<Department>(`${NAV_URL}/departments`, department);
  }

  /**
   * Get appointment list
   * @returns Observable of appointments array
   */
  getAppointmentList(): Observable<any[]> {
    return this._http.get<any[]>(`${NAV_URL}/appointments`);
  }

  /**
   * Add prescription from remote
   * @param prescription Prescription object
   * @returns Observable of any
   */
  addPrescriptionFromRemote(prescription: Prescription): Observable<any> {
    return this._http.post<any>(`${NAV_URL}/addPrescription`, prescription);
  }
}
