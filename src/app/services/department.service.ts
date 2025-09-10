import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Department } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = environment.apiURL;

  constructor(private http: HttpClient) { }

  /**
   * Get all departments
   * @returns Observable of Department array
   */
  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments`);
  }

  /**
   * Get department by ID
   * @param id Department ID
   * @returns Observable of Department
   */
  getDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/departments/${id}`);
  }

  /**
   * Create new department
   * @param department Department object
   * @returns Observable of created Department
   */
  createDepartment(department: Department): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/departments`, department);
  }

  /**
   * Update department
   * @param id Department ID
   * @param department Department object
   * @returns Observable of updated Department
   */
  updateDepartment(id: number, department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/departments/${id}`, department);
  }

  /**
   * Delete department
   * @param id Department ID
   * @returns Observable of any
   */
  deleteDepartment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/departments/${id}`);
  }

  /**
   * Get doctors by department
   * @param departmentId Department ID
   * @returns Observable of Doctor array
   */
  getDoctorsByDepartment(departmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/departments/${departmentId}/doctors`);
  }
}