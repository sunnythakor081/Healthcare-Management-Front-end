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

    if (this.currRole === 'doctor' || this.currRole === 'DOCTOR') {
      this._service.getPatientListByDoctorEmail(this.loggedUser).subscribe({
        next: (data) => this.patients = data,
        error: (err) => console.error('Error fetching patients:', err)
      });
    } else {
      this._service.getPatientList().subscribe({
        next: (data) => this.patients = data,
        error: (err) => console.error('Error fetching patients:', err)
      });
    }
    this.slots = this._service.getSlotDetails(this.loggedUser);
  }

  acceptRequest(patient: Appointment) {
    patient.appointmentstatus = 'processing';
    this._service.acceptRequestForPatientApproval(patient.slot).subscribe({
      next: (res) => {
        patient.appointmentstatus = 'accept';
      },
      error: (err) => {
        patient.appointmentstatus = 'false';
        console.error('Error accepting request:', err);
      }
    });
  }

  rejectRequest(patient: Appointment) {
    patient.appointmentstatus = 'processing';
    this._service.rejectRequestForPatientApproval(patient.slot).subscribe({
      next: (res) => {
        patient.appointmentstatus = 'reject';
      },
      error: (err) => {
        patient.appointmentstatus = 'false';
        console.error('Error rejecting request:', err);
      }
    });
  }

}