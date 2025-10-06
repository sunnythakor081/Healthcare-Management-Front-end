import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from '../../models/doctor';
import { DoctorService } from '../../services/doctor.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-approvedoctors',
  templateUrl: './approvedoctors.component.html',
  styleUrls: ['./approvedoctors.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent]
})
export class ApprovedoctorsComponent implements OnInit {

  currRole = '';
  loggedUser = '';
  doctors: Doctor[] = [];
  
  constructor(private _service: DoctorService) { }

  ngOnInit(): void {
    this.loggedUser = sessionStorage.getItem('loggedUser') || '';
    this.currRole = sessionStorage.getItem('ROLE') || '';
    this._service.getDoctorList().subscribe({
      next: (data) => this.doctors = data,
      error: (err) => console.error('Error fetching doctors:', err)
    });
  }

  acceptRequest(email: string) {
    const doctor = this.doctors.find(d => d.email === email);
    if (doctor) {
      doctor.status = 'processing';
    }
    this._service.acceptRequestForDoctorApproval(email).subscribe({
      next: (res) => {
        if (doctor) {
          doctor.status = 'accept';
        }
      },
      error: (err) => {
        if (doctor) {
          doctor.status = 'false';
        }
        console.error('Error accepting request:', err);
      }
    });
  }

  rejectRequest(email: string) {
    const doctor = this.doctors.find(d => d.email === email);
    if (doctor) {
      doctor.status = 'processing';
    }
    this._service.rejectRequestForDoctorApproval(email).subscribe({
      next: (res) => {
        if (doctor) {
          doctor.status = 'reject';
        }
      },
      error: (err) => {
        if (doctor) {
          doctor.status = 'false';
        }
        console.error('Error rejecting request:', err);
      }
    });
  }

}