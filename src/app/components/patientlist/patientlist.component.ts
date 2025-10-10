import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Appointment } from '../../models/appointment';
import { Slots } from '../../models/slots';
import { DoctorService } from '../../services/doctor.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-patientlist',
  templateUrl: './patientlist.component.html',
  styleUrls: ['./patientlist.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, NgxPaginationModule]
})
export class PatientlistComponent implements OnInit {

  currRole = '';
  loggedUser = '';
  patients: Appointment[] = [];
  slots: Observable<Slots[]> | undefined;
  page: number = 1; // For pagination

  constructor(private _service: DoctorService) { }

  ngOnInit(): void {
  this.loggedUser = sessionStorage.getItem('loggedUser') || '';
  this.currRole = sessionStorage.getItem('ROLE') || '';
  console.log('Logged user:', this.loggedUser, 'Role:', this.currRole);

  if (this.currRole === 'doctor' || this.currRole === 'DOCTOR') {
    console.log('Loading doctor patients...');
    this._service.getPatientListByDoctorEmail(this.loggedUser).subscribe({
      next: (data) => {
        console.log('Doctor patients data:', data);
        this.patients = data || [];
        if (this.patients.length === 0) {
          console.warn('No doctor patients, loading all as fallback...');
          // Fallback: All patients load karo if empty
          this._service.getPatientList().subscribe({
            next: (allData) => {
              this.patients = allData || [];
              console.log('Fallback all patients:', this.patients.length);
            },
            error: (err) => console.error('Fallback error:', err)
          });
        }
      },
      error: (err) => {
        console.error('Error fetching doctor patients:', err);
        this.patients = [];
        // Fallback on error
        this._service.getPatientList().subscribe({
          next: (allData) => this.patients = allData || [],
          error: (err) => console.error('All patients error:', err)
        });
      }
    });
  } else {
    console.log('Loading all patients...');
    this._service.getPatientList().subscribe({
      next: (data) => {
        console.log('All patients data:', data);
        this.patients = data || [];
      },
      error: (err) => {
        console.error('Error fetching all patients:', err);
        this.patients = [];
      }
    });
  }
  this.slots = this._service.getSlotDetails(this.loggedUser);
}

  acceptRequest(patient: Appointment) {
    console.log('Accepting patient:', patient.patientid);  // Debug
    patient.appointmentstatus = 'processing';
    this._service.acceptRequestForPatientApproval(patient.slot).subscribe({
      next: (res) => {
        console.log('Accept success:', res);  // Debug
        patient.appointmentstatus = 'accept';
      },
      error: (err) => {
        console.error('Accept error:', err);  // Debug
        patient.appointmentstatus = 'false';
      }
    });
  }

  rejectRequest(patient: Appointment) {
    console.log('Rejecting patient:', patient.patientid);  // Debug
    patient.appointmentstatus = 'processing';
    this._service.rejectRequestForPatientApproval(patient.slot).subscribe({
      next: (res) => {
        console.log('Reject success:', res);
        patient.appointmentstatus = 'reject';
      },
      error: (err) => {
        console.error('Reject error:', err);
        patient.appointmentstatus = 'false';
      }
    });
  }
}