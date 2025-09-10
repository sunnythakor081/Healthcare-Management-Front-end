import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { Doctor } from '../../models/doctor';
import { User } from '../../models/user';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {

  user = new User();
  doctor = new Doctor();
  msg = "";
  adminEmail = "";
  adminPassword = "";
  activeRole = 'patient'; // Default to patient
  isLoading = false;
  messageType = ""; // 'error' or 'success'

  constructor(private _service : LoginService, private _router : Router) { }

  ngOnInit(): void {
    // Initialize with patient role selected
    this.selectRole('patient');
  }

  selectRole(role: string) {
    this.activeRole = role;
    this.msg = ""; // Clear any previous error messages
    this.messageType = ""; // Reset message type
  }

  togglePassword(inputId: string) {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const icon = input.nextElementSibling?.querySelector('i') as HTMLElement;
    
    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'fa fa-eye-slash';
    } else {
      input.type = 'password';
      icon.className = 'fa fa-eye';
    }
  }

  loginUser() {
    this.isLoading = true;
    this.msg = "";
    
    this._service.loginUserFromRemote(this.user).subscribe(
      (data: any) => {
        console.log(data);
        console.log("Response Received");
        sessionStorage.setItem('loggedUser', this.user.email);
        sessionStorage.setItem('USER', "user");
        sessionStorage.setItem('ROLE', "user");
        sessionStorage.setItem('username', this.user.email); // Save email as username for now
        sessionStorage.setItem('name', this.user.email);
        sessionStorage.setItem('gender', "male");
        this.isLoading = false;
        
        // Show success message with SweetAlert2
        Swal.fire({
          title: 'Success!',
          text: 'Login successful!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Navigate after the alert is closed
          this._router.navigate(['/userdashboard']);
        });
      },
      (error: { error: any; }) => {
        console.log(error.error);
        this.msg = "Invalid credentials. Please check your email and password.";
        this.isLoading = false;
      }
    );
  }

  loginDoctor() {
    this.isLoading = true;
    this.msg = "";
    
    this._service.loginDoctorFromRemote(this.doctor).subscribe(
      (data: any) => {
        console.log(data);
        console.log("Response Received");
        sessionStorage.clear();
        sessionStorage.setItem('loggedUser', this.doctor.email);
        sessionStorage.setItem('USER', "doctor");
        sessionStorage.setItem('ROLE', "doctor");
        sessionStorage.setItem('doctorname', this.doctor.email); // Save email as doctorname for now
        sessionStorage.setItem('name', this.doctor.email);
        sessionStorage.setItem('gender', "male");
        this.isLoading = false;
        
        // Show success message with SweetAlert2
        Swal.fire({
          title: 'Success!',
          text: 'Login successful!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Navigate after the alert is closed
          this._router.navigate(['/doctordashboard']);
        });
      },
      (error: { error: any; }) => {
        console.log(error.error);
        this.msg = "Invalid credentials. Please check your email and password.";
        this.isLoading = false;
      }
    );
  }

  adminLogin() {
    this.isLoading = true;
    this.msg = "";
    
    // Check admin credentials
    if(this.adminEmail === 'admin@gmail.com' && this.adminPassword === 'admin123') {
      // Let the service handle setting the session storage keys
      if(this._service.adminLoginFromRemote(this.adminEmail, this.adminPassword)) {
        // Only set additional session storage items not set by the service
        sessionStorage.setItem('loggedUser', this.adminEmail);
        sessionStorage.setItem('name', "admin");
        sessionStorage.setItem('gender', "male");
        this.isLoading = false;
        
        // Show success message with SweetAlert2
        Swal.fire({
          title: 'Success!',
          text: 'Login successful!',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Navigate after the alert is closed
          this._router.navigate(['/admindashboard']);
        });
      }
    } else {
      console.log("Invalid Admin Credentials");
      this.msg = "Invalid admin credentials. Please check your email and password.";
      this.isLoading = false;
    }
  }

  // Helper method to get username from email (extract part before @)
  private getUsernameFromEmail(email: string): string {
    return email.split('@')[0];
  }

  // Method to clear form data
  clearForms() {
    this.user = new User();
    this.doctor = new Doctor();
    this.adminEmail = "";
    this.adminPassword = "";
    this.msg = "";
  }
}
