import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Slots } from '../../models/slots';
import { Doctor } from '../../models/doctor';
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

    if (!this.loggedUser || this.currRole !== 'doctor') {
      this._router.navigate(['/login']);
      return;
    }

    this.slot = new Slots();
    this.slot.email = this.loggedUser;

    this._service.getProfileDetails(this.loggedUser).subscribe({
      next: (profile: Doctor) => {
        this.slot.doctorname = profile.doctorname || 'Unknown Doctor';
        this.slot.specialization = profile.specialization || 'Unknown Specialization';
        console.log('Pre-filled doctor data:', this.slot);
        if (!profile.doctorname || !profile.specialization) {
          this.error = 'Profile data incomplete. Please update your profile.';
        }
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.error = 'Failed to load doctor profile. Please contact admin.';
        this.slot.doctorname = 'Unknown Doctor';
        this.slot.specialization = 'Unknown Specialization';
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
      this.error = null;
      this.slot = new Slots();
      this.slot.email = this.loggedUser;
      this._service.getProfileDetails(this.loggedUser).subscribe({
        next: (profile: Doctor) => {
          this.slot.doctorname = profile.doctorname || 'Unknown Doctor';
          this.slot.specialization = profile.specialization || 'Unknown Specialization';
          console.log('Form pre-filled:', this.slot);
          if (!profile.doctorname || !profile.specialization) {
            this.error = 'Profile data incomplete. Please update your profile.';
          }
        },
        error: (error) => {
          console.error('Error loading profile:', error);
          this.error = 'Failed to load doctor profile. Please contact admin.';
          this.slot.doctorname = 'Unknown Doctor';
          this.slot.specialization = 'Unknown Specialization';
        }
      });
    }
  }

  validateSlot(): { isValid: boolean, message: string } {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(this.slot.date);
    selectedDate.setHours(0, 0, 0, 0);

    if (!this.slot.doctorname?.trim() || this.slot.doctorname === 'Unknown Doctor') {
      return { isValid: false, message: 'Valid doctor name is required' };
    }
    if (!this.slot.email?.trim()) {
      return { isValid: false, message: 'Email is required' };
    }
    if (!this.slot.specialization?.trim() || this.slot.specialization === 'Unknown Specialization') {
      return { isValid: false, message: 'Valid specialization is required' };
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
      this.successMessage = null;
      return;
    }

    this.isLoading = true;
    this.error = null;
    this.successMessage = null;

    this.slot.amstatus = this.slot.amslot && this.slot.amslot !== 'empty' ? 'unbooked' : 'empty';
    this.slot.noonstatus = this.slot.noonslot && this.slot.noonslot !== 'empty' ? 'unbooked' : 'empty';
    this.slot.pmstatus = this.slot.pmslot && this.slot.pmslot !== 'empty' ? 'unbooked' : 'empty';

    const date = new Date(this.slot.date);
    this.slot.date = date.toISOString().split('T')[0];

    this._service.addBookingSlots(this.slot).subscribe({
      next: (response) => {
        console.log('Backend response:', response);
        this.successMessage = 'Slots added successfully! 🎉';
        this.isLoading = false;
        this.loadDoctorSlots();
        this.showForm = false;
        this.slot = new Slots();
        this.slot.email = this.loggedUser;
        this._service.getProfileDetails(this.loggedUser).subscribe({
          next: (profile: Doctor) => {
            this.slot.doctorname = profile.doctorname || 'Unknown Doctor';
            this.slot.specialization = profile.specialization || 'Unknown Specialization';
          }
        });

        setTimeout(() => {
          this.successMessage = null;
          this._router.navigate(['/doctordashboard']);
        }, 3000);
      },
      error: (err) => {
        console.error('Error adding slots:', err);
        this.isLoading = false;
        this.successMessage = null;
        this.error = `Failed to add slots: ${err.message || 'Please try again.'}`;
      }
    });
  }
}