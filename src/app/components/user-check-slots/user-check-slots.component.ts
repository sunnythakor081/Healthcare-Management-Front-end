import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Navigation ke liye
import { Observable } from 'rxjs';
import { Slots } from '../../models/slots';
import { DoctorService } from '../../services/doctor.service';  // Service use karo (ya UserService if alag)
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-check-slots',
  templateUrl: './user-check-slots.component.html',
    styleUrls: ['./user-check-slots.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent]
})
export class UserCheckSlotsComponent implements OnInit {

  currRole = '';
  loggedUser = '';
  slots: Slots[] = [];
  isLoading = false;
  error: string | null = null;
  
  constructor(private _service: DoctorService, private _router: Router) { }

 ngOnInit(): void {
  this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser') || '{}');
  this.loggedUser = this.loggedUser.replace(/"/g, '');

  this.currRole = JSON.stringify(sessionStorage.getItem('ROLE') || '{}'); 
  this.currRole = this.currRole.replace(/"/g, '');

  // User role check (case insensitive bana diya)
  if (this.currRole.toUpperCase() !== 'USER') {
    console.log('Role not USER, redirecting:', this.currRole);  // Debug add
    this._router.navigate(['/login']);
    return;
  }
  console.log('User role confirmed:', this.currRole);  // Debug

  this.loadSlots();
}

  loadSlots() {
  this.isLoading = true;
  this.error = null;
  console.log('Loading slots for user:', this.loggedUser);

  // Pehle general slots try karo
  this._service.getSlotList().subscribe({
    next: (slots) => {
      console.log('User slots response:', slots);
      console.log('Slots length:', slots ? slots.length : 0);
      this.slots = slots || [];
      if (this.slots.length === 0) {
        console.log('General slots empty, trying unique doctors...');  // Fallback
        this._service.getSlotListWithUniqueDoctors().subscribe({
          next: (uniqueData) => {
            this.slots = uniqueData || [];  // Use unique if available
            console.log('Fallback unique slots:', this.slots.length);
          },
          error: (err) => console.error('Unique fallback error:', err)
        });
      }
      // Filter unbooked
      this.slots = this.slots.filter(slot => 
        (slot.amstatus === 'unbooked' && slot.amslot !== 'empty') ||
        (slot.noonstatus === 'unbooked' && slot.noonslot !== 'empty') ||
        (slot.pmstatus === 'unbooked' && slot.pmslot !== 'empty')
      );
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading user slots:', err);
      console.log('Error status:', err.status);
      if (err.status === 404) {
        this.error = 'No slots are currently available.';
      } else if (err.status === 0) {
        this.error = 'Unable to connect to server. Please check your connection.';
      } else {
        this.error = `Error loading slots: ${err.message || 'Unknown error'}`;
      }
      this.isLoading = false;
    }
  });
}

  // Slot book karne ka function
  bookSlot(slot: Slots, timeSlot: 'am' | 'noon' | 'pm') {
    if (this.currRole !== 'USER') {
      alert('Please login as user to book.');
      return;
    }
    console.log('Booking slot:', slot, 'Time:', timeSlot);
    // Slot data session mein store karo book page ke liye
    sessionStorage.setItem('selectedSlot', JSON.stringify(slot));
    sessionStorage.setItem('selectedTime', timeSlot);
    this._router.navigate(['/bookappointment']);  // Book page pe jaao (route bana lo)
  }

  // Slot available check
  isSlotAvailable(slot: Slots, timeSlot: 'am' | 'noon' | 'pm'): boolean {
    switch(timeSlot) {
      case 'am':
        return slot.amstatus === 'unbooked' && slot.amslot !== 'empty';
      case 'noon':
        return slot.noonstatus === 'unbooked' && slot.noonslot !== 'empty';
      case 'pm':
        return slot.pmstatus === 'unbooked' && slot.pmslot !== 'empty';
    }
  }

  refreshSlots() {
    this.loadSlots();
  }
}