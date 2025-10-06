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
<<<<<<< HEAD
  patients: Appointment[] = [];
=======
  patients: Appointment[] = []; // Change to array for local updates
>>>>>>> cde3b3e98fa3a5d9179dcf168e64f30a62a4b031
  slots: Observable<Slots[]> | undefined;
  page: number = 1; // For pagination

  constructor(private _service: DoctorService) { }

  ngOnInit(): void {
    this.loggedUser = sessionStorage.getItem('loggedUser') || '';
    this.currRole = sessionStorage.getItem('ROLE') || '';

<<<<<<< HEAD
    if (this.currRole === 'doctor' || this.currRole === 'DOCTOR') {
=======
    if (this.currRole === "user") {
>>>>>>> cde3b3e98fa3a5d9179dcf168e64f30a62a4b031
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
<<<<<<< HEAD
    patient.appointmentstatus = 'processing';
    this._service.acceptRequestForPatientApproval(patient.slot).subscribe({
      next: (res) => {
        patient.appointmentstatus = 'accept';
      },
      error: (err) => {
        patient.appointmentstatus = 'false';
        console.error('Error accepting request:', err);
=======
    // Pass the full patient or slot as needed; assuming service accepts slot
    this._service.acceptRequestForPatientApproval(patient.slot).subscribe({
      next: (response) => {
        // Update local patient status on success
        patient.appointmentstatus = 'accept';
        console.log('Accepted:', response);
      },
      error: (err) => {
        console.error('Error accepting request:', err);
        // Optionally show error message to user
        alert('Failed to accept. Please try again.');
>>>>>>> cde3b3e98fa3a5d9179dcf168e64f30a62a4b031
      }
    });
  }

  rejectRequest(patient: Appointment) {
<<<<<<< HEAD
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

=======
    this._service.rejectRequestForPatientApproval(patient.slot).subscribe({
      next: (response) => {
        // Update local patient status on success
        patient.appointmentstatus = 'reject';
        console.log('Rejected:', response);
      },
      error: (err) => {
        console.error('Error rejecting request:', err);
        // Optionally show error message to user
        alert('Failed to reject. Please try again.');
      }
    });
  }
>>>>>>> cde3b3e98fa3a5d9179dcf168e64f30a62a4b031
}