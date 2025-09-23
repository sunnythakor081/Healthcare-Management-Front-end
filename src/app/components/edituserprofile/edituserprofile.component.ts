import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-edituserprofile',
  templateUrl: './edituserprofile.component.html',
  styleUrls: ['./edituserprofile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent]
})
export class EditUserProfileComponent implements OnInit {

  profileDetails: Observable<User[]> | undefined;
  user: User = new User();
  msg = '';
  successMessage = '';
  errorMessage = '';
  loggedUser = '';
  isLoading = false;
  isEditing = false;
  showPassword = false;

  constructor(private _service: UserService, private _router: Router) { }

  ngOnInit(): void {
    // Get logged user from session storage
    const storedUser = sessionStorage.getItem('loggedUser');
    if (storedUser) {
      this.loggedUser = storedUser;
      // Load user profile data
      this.loadUserProfile();
    } else {
      this.errorMessage = 'User not logged in. Please log in to view profile.';
      this.isLoading = false;
    }
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.profileDetails = this._service.getProfileDetails(this.loggedUser);
    
    // Subscribe to get the actual data
    this.profileDetails.subscribe(
      (data: User[]) => {
        if (data && data.length > 0) {
          // Pre-fill the form with existing user data
          this.user = { ...data[0] };
          this.isLoading = false;
        } else {
          this.errorMessage = 'No profile data found. Please update your profile.';
          this.isLoading = false;
          this.isEditing = true; // Automatically show edit form if no data
        }
      },
      (error) => {
        console.error('Error loading profile:', error);
        this.errorMessage = 'Failed to load profile data. Please try again.';
        this.isLoading = false;
      }
    );
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    // Reset messages when toggling edit mode
    this.successMessage = '';
    this.errorMessage = '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  validateUserData(): { isValid: boolean; message: string } {
    if (!this.user.username?.trim()) {
      return { isValid: false, message: 'Username is required' };
    }
    if (!this.user.email?.trim()) {
      return { isValid: false, message: 'Email is required' };
    }
    if (!this.user.password?.trim()) {
      return { isValid: false, message: 'Password is required' };
    }
    // Add any other validation rules
    return { isValid: true, message: '' };
  }

  updateUserProfile(): void {
    // Validate user data
    const validation = this.validateUserData();
    if (!validation.isValid) {
      this.errorMessage = validation.message;
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    // Clean up user data before sending
    const userData = {
      ...this.user,
      username: this.user.username.trim(),
      email: this.user.email.trim(),
      password: this.user.password.trim()
    };

    let retryCount = 0;
    const maxRetries = 3;
    
    const attemptUpdate = () => {
      this._service.UpdateUserProfile(userData).subscribe({
        next: (data: any) => {
          console.log('User profile updated successfully');
          this.successMessage = 'Profile updated successfully!';
          this.isEditing = false;
          this.isLoading = false;
          
          // Reload the profile data to show updated information
          this.loadUserProfile();
          
          // Redirect after a short delay
          setTimeout(() => {
            this._router.navigate(['/userdashboard']);
          }, 2000);
        },
        error: (error: any) => {
          console.error('Profile update failed:', error);
          
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying update (attempt ${retryCount} of ${maxRetries})...`);
            setTimeout(() => attemptUpdate(), 1000 * retryCount); // Exponential backoff
            return;
          }

          if (error.status === 0) {
            this.errorMessage = 'Cannot connect to server. Please check your connection and try again.';
          } else if (error.status === 404) {
            this.errorMessage = 'User not found. Please try logging in again.';
          } else if (error.status === 400) {
            this.errorMessage = 'Invalid data provided. Please check your inputs.';
          } else if (error.status === 401) {
            this.errorMessage = 'Session expired. Please log in again.';
            setTimeout(() => this._router.navigate(['/login']), 2000);
          } else {
            this.errorMessage = 'Failed to update profile. Please try again later.';
          }
          
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    };

    attemptUpdate();
  }

  cancelEdit(): void {
    this.isEditing = false;
    // Reload the original data
    this.loadUserProfile();
  }
}