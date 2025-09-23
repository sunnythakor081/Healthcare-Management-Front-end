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

    // Try unique doctors endpoint first, fall back to general slot list
    this._service.getSlotListWithUniqueDoctors().subscribe({
      next: (data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          this.slots = data;
          this.isLoading = false;
        } else {
          // If no data from unique doctors endpoint, try general slot list
          this._service.getSlotList().subscribe({
            next: (slots) => {
              this.slots = slots;
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Error loading general slots:', err);
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
        console.error('Error loading slots with unique doctors:', error);
        // Fall back to general slot list on error
        this._service.getSlotList().subscribe({
          next: (slots) => {
            this.slots = slots;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error loading general slots:', err);
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
