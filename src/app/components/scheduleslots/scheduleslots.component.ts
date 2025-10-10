import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Slots } from '../../models/slots';
import { DoctorService } from '../../services/doctor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-scheduleslots',
  templateUrl: './scheduleslots.component.html',
  styleUrls: ['./scheduleslots.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent]
})
export class ScheduleslotsComponent implements OnInit {
  currRole = '';
  loggedUser = '';
  slot = new Slots();
  slots: Slots[] = [];
  isLoading = false;
  error: string | null = null;
  showForm = false;
  successMessage: string | null = null;
  
  constructor(private _service: DoctorService, private _router: Router) { }

  ngOnInit(): void {
    this.initializeUserData();
    this.loadDoctorSlots();
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  private initializeUserData() {
    const loggedUserStr = sessionStorage.getItem('loggedUser');
    this.loggedUser = loggedUserStr ? loggedUserStr.replace(/"/g, '') : '';

    const roleStr = sessionStorage.getItem('ROLE');
    this.currRole = roleStr ? roleStr.replace(/"/g, '') : '';

    if (!this.loggedUser) {
      this._router.navigate(['/login']);
      return;
    }

    this.slot = new Slots(); // Reset slot data
    this.slot.email = this.loggedUser;

    // Pre-fill doctor information
    this._service.getProfileDetails(this.loggedUser).subscribe({
      next: (profile) => {
        this.slot.doctorname = profile.username;
        this.slot.specialization = profile.specialization;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.error = 'Failed to load doctor profile. Please try again.';
      }
    });
  }

  private loadDoctorSlots() {
    this.isLoading = true;
    this.error = null;

    this._service.getSlotDetails(this.loggedUser).subscribe({
      next: (data) => {
        this.slots = data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading slots:', error);
        this.error = 'Failed to load slots. Please try again.';
        this.isLoading = false;
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.error = null; // Clear any errors when showing form
      // Re-initialize slot data
      this.slot = new Slots();
      this.slot.email = this.loggedUser;
      this._service.getProfileDetails(this.loggedUser).subscribe({
        next: (profile) => {
          this.slot.doctorname = profile.username;
          this.slot.specialization = profile.specialization;
        }
      });
    }
  }

  validateSlot(): { isValid: boolean, message: string } {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for date comparison
    const selectedDate = new Date(this.slot.date);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (!this.slot.doctorname?.trim()) {
      return { isValid: false, message: 'Doctor name is required' };
    }
    if (!this.slot.email?.trim()) {
      return { isValid: false, message: 'Email is required' };
    }
    if (!this.slot.specialization?.trim()) {
      return { isValid: false, message: 'Specialization is required' };
    }
    if (!this.slot.date) {
      return { isValid: false, message: 'Date is required' };
    }
    if (selectedDate < today) {
      return { isValid: false, message: 'Cannot schedule slots for past dates' };
    }
    if (!this.slot.patienttype) {
      return { isValid: false, message: 'Patient type is required' };
    }

    // Check for existing slots on the same date
    const existingSlot = this.slots.find(s => {
      const slotDate = new Date(s.date);
      slotDate.setHours(0, 0, 0, 0);
      return slotDate.getTime() === selectedDate.getTime();
    });

    if (existingSlot) {
      return { isValid: false, message: 'You already have slots scheduled for this date' };
    }

    return { isValid: true, message: '' };
  }

  addSlot() {
    const validation = this.validateSlot();
    if (!validation.isValid) {
      this.error = validation.message;
      this.successMessage = null; // Clear any previous success
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.successMessage = null;

    // Set default status for new slots
    this.slot.amstatus = 'unbooked';
    this.slot.noonstatus = 'unbooked';
    this.slot.pmstatus = 'unbooked';

    // Format the date to match the expected format
    const date = new Date(this.slot.date);
    this.slot.date = date.toISOString().split('T')[0];

    this._service.addBookingSlots(this.slot).subscribe({
      next: (response) => {
        // Response is now plain text like "modified successfully !!!", so we can log it but ignore for UI
        console.log('Backend response:', response);
        this.successMessage = 'Slots added successfully! 🎉';
        this.isLoading = false;
        this.loadDoctorSlots(); // Refresh the slots list
        this.showForm = false;
        this.slot = new Slots(); // Reset form

        // Auto-hide success message after 3 seconds and navigate
        setTimeout(() => {
          this.successMessage = null;
          this._router.navigate(['/doctordashboard']);
        }, 3000);
      },
      error: (err) => {
        console.error('Error adding slots:', err);
        this.isLoading = false;
        this.successMessage = null; // Clear any previous success
        // Improved error handling for non-200 errors
        if (err.error instanceof ErrorEvent) {
          this.error = 'Network error: Please check your connection and try again.';
        } else {
          this.error = `Server error (${err.status}): ${err.message || 'Failed to add slots. Please try again later.'}`;
        }
      }
    });
  }
}