import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';

const NAV_URL = 'http://localhost:8080'; // Yeh tera base URL, change kar agar alag hai

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private _http: HttpClient) { }

  // Ek call me sab stats fetch kar
  getDashboardStats(): Observable<any> {
    return this._http.get<any>(`${NAV_URL}/admin/dashboard`).pipe(
      tap(stats => console.log('Fetched stats:', stats)), // Debug ke liye
      catchError(error => {
        console.error('Error fetching stats:', error);
        return of({ // Default 0 if error
          totalUsers: 0,
          totalDoctors: 0,
          totalSlots: 0,
          totalAppointments: 0,
          totalPrescriptions: 0,
          totalPatients: 0
        });
      })
    );
  }
}