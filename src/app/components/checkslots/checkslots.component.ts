import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Slots } from '../../models/slots';
import { DoctorService } from '../../services/doctor.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkslots',
  templateUrl: './checkslots.component.html',
  styleUrls: ['./checkslots.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent]
})
export class CheckslotsComponent implements OnInit {

  currRole = '';
  loggedUser = '';
  slots: Slots[] = [];
  isLoading = false;
  error: string | null = null;
  
  constructor(private _service : DoctorService) { }

  ngOnInit(): void {
    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser')|| '{}');
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE')|| '{}'); 
    this.currRole = this.currRole.replace(/"/g, '');

    this.loadSlots();
  }

loadSlots() {
  this.isLoading = true;
  this.error = null;
  console.log('Loading slots for role:', this.currRole, 'user:', this.loggedUser);  // Add: Context log

  // Try unique doctors endpoint first, fall back to general slot list
  this._service.getSlotListWithUniqueDoctors().subscribe({
    next: (data) => {
      console.log('Unique doctors slots response:', data);  // Add: Full data log
      console.log('Unique doctors slots length:', data ? data.length : 0);  // Add: Length
      if (data && Array.isArray(data) && data.length > 0) {
        this.slots = data;
        this.isLoading = false;
        console.log('Slots set from unique doctors:', this.slots.length);  // Add
      } else {
        console.log('Unique doctors empty, falling back to general...');  // Add
        // If no data from unique doctors endpoint, try general slot list
        this._service.getSlotList().subscribe({
          next: (slots) => {
            console.log('General slots response:', slots);  // Add: Full data
            console.log('General slots length:', slots ? slots.length : 0);  // Add
            this.slots = slots || [];  // Ensure array
            this.isLoading = false;
            console.log('Final slots set:', this.slots.length);  // Add
          },
          error: (err) => {
            console.error('Error loading general slots:', err);  // Existing
            console.log('General error status:', err.status);  // Add: Status (404?)
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
    },
    error: (error) => {
      console.error('Error loading slots with unique doctors:', error);  // Existing
      console.log('Unique doctors error status:', error.status);  // Add
      // Fall back to general slot list on error
      this._service.getSlotList().subscribe({
        next: (slots) => {
          console.log('General slots response (fallback):', slots);  // Add
          this.slots = slots || [];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading general slots (fallback):', err);
          console.log('Fallback error status:', err.status);
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
  });
}

  // Helper method to check if a slot is available
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

  // Refresh slots data
  refreshSlots() {
    this.loadSlots();
  }

}
