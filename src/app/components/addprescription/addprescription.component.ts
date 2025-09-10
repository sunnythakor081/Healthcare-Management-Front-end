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
export class AddprescriptionComponent implements OnInit 
{
  message = '';
  prescriptionobj = new Prescription();
  appointment : Observable<Appointment[]> | undefined;
  isSubmitting = false;

  constructor(private _service : DoctorService, private _router: Router) { }

  ngOnInit(): void 
  {
    this.appointment = this._service.getAppointmentList();
  }

  addPrescription()
  {
    this.isSubmitting = true;
    
    this._service.addPrescriptionFromRemote(this.prescriptionobj).subscribe(
      (data: any) => {
        console.log("Prescription added Successfully");
        this.isSubmitting = false;
        this.message = "Prescription added Successfully!";
        this._router.navigate(['/doctordashboard']);
      },
      (error: any) => {
        console.log("process Failed");
        this.isSubmitting = false;
        this.message = "Failed to add prescription. Please try again.";
        console.log(error.error);
      }
    )
  }
}