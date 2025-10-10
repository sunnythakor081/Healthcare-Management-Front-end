import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Appointment } from '../../models/appointment';
import { Prescription } from '../../models/prescription';
import { DoctorService } from '../../services/doctor.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-addprescription',
  templateUrl: './addprescription.component.html',
  styleUrls: ['./addprescription.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent]
})
export class AddprescriptionComponent implements OnInit {
  message = '';
  prescriptionobj = new Prescription();
  appointment: Observable<Appointment[]> | undefined;  // Keep type Appointment[]
  isSubmitting = false;
  loggedDoctorEmail = '';

  constructor(private _service: DoctorService, private _router: Router) { }

  ngOnInit(): void {
    this.loggedDoctorEmail = sessionStorage.getItem('loggedUser') || '';  // Doctor's email from session
    console.log('Logged doctor email for filter:', this.loggedDoctorEmail);  // Debug

    // Load doctor-specific patients (exact names from backend)
    this.appointment = this._service.getPatientListByDoctorEmail(this.loggedDoctorEmail);

    // Auto-set doctor name (assume stored in session at login; adjust if from profile)
    const doctorName = sessionStorage.getItem('doctorName') || this.loggedDoctorEmail;  // Fallback to email if not stored
    this.prescriptionobj.doctorname = doctorName;
    console.log('Auto-set doctor name:', this.prescriptionobj.doctorname);  // Debug
  }

  addPrescription() {
    this.isSubmitting = true;
    
    // Trim patientname to remove spaces for exact match
    if (this.prescriptionobj.patientname) {
      this.prescriptionobj.patientname = this.prescriptionobj.patientname.trim();
    }
    console.log('Trimmed form data before submit:', this.prescriptionobj);  // Updated log
    console.log('Trimmed patient name selected:', this.prescriptionobj.patientname);  // Specific check

    this._service.addPrescriptionFromRemote(this.prescriptionobj).subscribe({
      next: (response: any) => {  // Now response is text, so any
        console.log("Prescription added Successfully", response);
        this.isSubmitting = false;
        this.message = "Success! Prescription added successfully!";  // Updated for consistent 'Success' trigger
        // Delay navigation to show success message for 3 seconds (increased for better visibility)
        setTimeout(() => {
          this._router.navigate(['/doctordashboard']);
        }, 3000);
      },
      error: (error: any) => {
        console.log("process Failed");
        console.log('Full error response:', error);
        console.log('Error status:', error.status);  // e.g., 400
        console.log('Error message:', error.error);  // e.g., "Patient not found"
        this.isSubmitting = false;
        this.message = "Failed to add prescription. Please try again.";
      }
    });
  }
}