import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Doctor } from '../../models/doctor';
import { DoctorService } from '../../services/doctor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-editdoctorprofile',
  templateUrl: './editdoctorprofile.component.html',
  styleUrls: ['./editdoctorprofile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent]
})
export class EditDoctorProfileComponent implements OnInit {
  doctor = new Doctor();
  loggedUser = '';
  message = '';
  isSubmitting = false;
  showMessage = false;
  imagePreview: string | ArrayBuffer | null = null;
  specializations = [
    'General Physician',
    'Cardiologist',
    'Neurologist',
    'Orthopedic Surgeon',
    'Pediatrician',
    'Dermatologist',
    'Gynecologist',
    'ENT Specialist',
    'Psychiatrist',
    'Ophthalmologist',
    'Oncologist',
    'Pulmonologist',
    'Gastroenterologist',
    'Urologist',
    'Endocrinologist',
    'Nephrologist',
    'Rheumatologist',
    'Anesthesiologist',
    'Radiologist',
    'Dentist'
  ];

  constructor(private doctorService: DoctorService, private router: Router) { }

  ngOnInit(): void {
    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser') || '{}');
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    // Get doctor's current profile
    this.doctorService.getDoctorByEmail(this.loggedUser).subscribe(
      data => {
        this.doctor = data;
        // Reset any sensitive data that shouldn't be pre-filled
        this.doctor.password = '';
      },
      error => {
        console.error('Error fetching doctor profile:', error);
        this.showError('Unable to load your profile. Please try again later.');
      }
    );
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);

      // You would typically upload the image to your server here
      // For now, we'll just store the preview
      this.doctor.profileImage = file;
    }
  }

  updateProfile() {
    this.isSubmitting = true;
    this.showMessage = false;

    // Add email from logged in user
    this.doctor.email = this.loggedUser;

    this.doctorService.updateDoctor(this.doctor).subscribe(
      data => {
        this.isSubmitting = false;
        this.showSuccess('Profile updated successfully!');
        setTimeout(() => {
          this.router.navigate(['/doctordashboard']);
        }, 2000);
      },
      error => {
        this.isSubmitting = false;
        this.showError('Unable to update profile. Please try again.');
        console.error('Error updating profile:', error);
      }
    );
  }

  showSuccess(message: string) {
    this.message = message;
    this.showMessage = true;
  }

  showError(message: string) {
    this.message = message;
    this.showMessage = true;
  }

  cancel() {
    this.router.navigate(['/doctordashboard']);
  }

  // Validators
  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone: string): boolean {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  }
}