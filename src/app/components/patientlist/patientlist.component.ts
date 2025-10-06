import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Appointment } from '../../models/appointment';
import { Doctor } from '../../models/doctor';
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
  patients: Appointment[] = []; // Change to array for local updates
  slots: Observable<Slots[]> | undefined;
  page: number = 1; // For pagination

  constructor(private _service: DoctorService) { }

  ngOnInit(): void {
    this.loggedUser = sessionStorage.getItem('loggedUser') || '';
    this.currRole = sessionStorage.getItem('ROLE') || '';

    if (this.currRole === "user") {
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
      }
    });
  }

  rejectRequest(patient: Appointment) {
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
}