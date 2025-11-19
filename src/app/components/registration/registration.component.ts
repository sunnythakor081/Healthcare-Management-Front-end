import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Doctor } from '../../models/doctor';
import { User } from '../../models/user';
import { DoctorService } from '../../services/doctor.service';
import { RegistrationService } from '../../services/registration.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RegistrationComponent implements OnInit {

  user = new User();
  doctor = new Doctor();
  msg = '';
  msgType = ''; // 'error' or 'success'
  
  activeTab: 'patient' | 'doctor' = 'patient';
  userPasswordVisible = false;
  userConfirmPasswordVisible = false;
  doctorPasswordVisible = false;
  doctorConfirmPasswordVisible = false;

  selectTab(tab: 'patient' | 'doctor') {
    this.activeTab = tab;
    this.msg = '';
    this.msgType = '';
    // Reset forms on tab switch
    if (tab === 'patient') {
      this.user = new User();
    } else {
      this.doctor = new Doctor();
    }
  }

  togglePasswordVisibility(field: string) {
    switch (field) {
      case 'userPassword':
        this.userPasswordVisible = !this.userPasswordVisible;
        break;
      case 'userConfirmPassword':
        this.userConfirmPasswordVisible = !this.userConfirmPasswordVisible;
        break;
      case 'doctorPassword':
        this.doctorPasswordVisible = !this.doctorPasswordVisible;
        break;
      case 'doctorConfirmPassword':
        this.doctorConfirmPasswordVisible = !this.doctorConfirmPasswordVisible;
        break;
    }
  }

  constructor(
    private _registrationService: RegistrationService, 
    private _doctorService: DoctorService, 
    private _router: Router
  ) { }

  ngOnInit(): void {
    // Optional: Pre-fill if needed from session
  }

  registerUser() {
    if (!this.user.termsAccepted) {
      Swal.fire({
        title: 'Agreement Required!',
        text: 'Please accept the terms and conditions.',
        icon: 'warning',
        confirmButtonColor: '#10b981'
      });
      return;
    }
    this.msg = '';
    this.msgType = '';
    this._registrationService.registerUserFromRemote(this.user).subscribe({
      next: (data) => {
        console.log("Patient Registration Success", data);
        sessionStorage.setItem("username", this.user.username || '');
        sessionStorage.setItem("gender", this.user.gender || '');
        this.msgType = 'success';
        this.msg = 'Registration successful! Redirecting...';
        
        Swal.fire({
          title: 'Welcome Aboard!',
          text: 'Your patient account is ready. Redirecting to dashboard...',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: '#10b981'
        }).then(() => {
          this._router.navigate(['/dashboard/patient']);
        });
      },
      error: (error) => {
        console.error("Patient Registration Failed", error);
        this.msgType = 'error';
        this.msg = error.error?.message || `Registration failed for ${this.user.email}. Please try again.`;
        Swal.fire({
          title: 'Registration Issue',
          text: this.msg,
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

  registerDoctor() {
    if (!this.doctor.termsAccepted) {
      Swal.fire({
        title: 'Agreement Required!',
        text: 'Please accept the professional terms.',
        icon: 'warning',
        confirmButtonColor: '#10b981'
      });
      return;
    }
    this.msg = '';
    this.msgType = '';
    this._registrationService.registerDoctorFromRemote(this.doctor).subscribe({
      next: (data) => {
        console.log("Doctor Registration Success", data);
        sessionStorage.setItem("doctorname", this.doctor.doctorname || '');
        sessionStorage.setItem("gender", this.doctor.gender || '');
        this.msgType = 'success';
        this.msg = 'Doctor registration successful! Redirecting...';
        
        Swal.fire({
          title: 'Provider Verified!',
          text: 'Your doctor profile is active. Redirecting to portal...',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: '#10b981'
        }).then(() => {
          this._router.navigate(['/dashboard/doctor']);
        });
      },
      error: (error) => {
        console.error("Doctor Registration Failed", error);
        this.msgType = 'error';
        this.msg = error.error?.message || `Doctor registration failed for ${this.doctor.email}.`;
        Swal.fire({
          title: 'Registration Issue',
          text: this.msg,
          icon: 'error',
          confirmButtonColor: '#ef4444'
        });
      }
    });
  }

}