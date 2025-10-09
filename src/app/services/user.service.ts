import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Appointment } from '../models/appointment';
import { Doctor } from '../models/doctor';
import { User } from '../models/user';  

const NAV_URL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private _http : HttpClient) { }

  getAllUsers() : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/userlist`);
  }

  addBookingAppointments(appointment : Appointment) : Observable<any>
  {
    return this._http.post<any>(`${NAV_URL}/bookNewAppointment`,appointment);
  }

  getPrescriptionsByName(name : string) : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/getprescriptionbyname/`+name);
  }

  public getProfileDetails(loggedUser : string) : Observable<any>
  {
    return this._http.get(`${NAV_URL}/profileDetails/`+loggedUser);
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      timeout: 30000 // 30 seconds timeout
    };
  }

 // ... (other imports and code) ...

public UpdateUserProfile(user: User): Observable<any> {  // Change 'any' to User for type safety
  return this._http.put<any>(`${NAV_URL}/updateuser/${user.id}`, user, this.getHttpOptions())  // Add /${user.id}
    .pipe(
      retry(3),
      timeout(30000),
      catchError(this.handleError)
    );
}

  public getTotalPatients() : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/gettotalpatients`);
  }

  public getTotalUsers() : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/gettotalusers`);
  }

  public getTotalDoctors() : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/gettotaldoctors`);
  }

  public getTotalSlots() : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/gettotalslots`);
  }

  public getTotalAppointments() : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/gettotalappointments`);
  }

  public getTotalPrescriptions() : Observable<any>
  {
    return this._http.get<any>(`${NAV_URL}/gettotalprescriptions`);
  }

  // Admin specific methods
  public approveDoctor(doctorId: number): Observable<any> {
    return this._http.put<any>(`${NAV_URL}/admin/approveDoctor/${doctorId}`, {});
  }

  public rejectDoctor(doctorId: number): Observable<any> {
    return this._http.put<any>(`${NAV_URL}/admin/rejectDoctor/${doctorId}`, {});
  }

  public deleteUser(userId: number): Observable<any> {
    return this._http.delete<any>(`${NAV_URL}/admin/deleteUser/${userId}`);
  }

  public addDoctor(doctor: Doctor): Observable<any> {
    return this._http.post<any>(`${NAV_URL}/admin/addDoctor`, doctor);
  }

  public updateDoctor(doctor: Doctor): Observable<any> {
    return this._http.put<any>(`${NAV_URL}/admin/updateDoctor`, doctor);
  }

  public getDoctorById(doctorId: number): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/admin/doctor/${doctorId}`);
  }

  public getUserById(userId: number): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/admin/user/${userId}`);
  }

  public getDepartments(): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/admin/departments`);
  }

  public addDepartment(department: any): Observable<any> {
    return this._http.post<any>(`${NAV_URL}/admin/addDepartment`, department);
  }

  public getSystemStats(): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/admin/stats`);
  }
}
