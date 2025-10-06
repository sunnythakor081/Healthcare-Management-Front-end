import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Appointment } from '../../models/appointment';
import { Slots } from '../../models/slots';
import { DoctorService } from '../../services/doctor.service';
import { UserService } from '../../services/user.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bookappointment',
  templateUrl: './bookappointment.component.html',
  styleUrls: ['./bookappointment.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent]
})
export class BookappointmentComponent implements OnInit {
  
  currRole = '';
  loggedUser = '';
  message = '';
  appointment = new Appointment();
  slots : Observable<Slots[]> | undefined;
  doctors : Observable<Slots[]> | undefined;
  allDoctors : Slots[] = [];
  filteredDoctors : string[] = [];
  specializations : Observable<Slots[]> | undefined;
  isSubmitting = false;
  showMessage = false;
  showForm = true;
  selectedDate = '';
  availableSlots: string[] = [];
  selectedDoctor: any = null;
  doctorname: any; // Added for template reference
  private retryCount = 0;
  private maxRetries = 3;
  
  constructor(private _service : DoctorService, private _router: Router, private userService : UserService) { }

  ngOnInit(): void
  {
  
   this.specializations = this._service.getSlotListWithUniqueSpecializations().pipe();
  // Yeh add karo debug ke liye
  this.specializations.subscribe({
    next: (data) => {
      console.log('Specializations data from backend:', data); // Yeh check karo console mein, array aana chahiye
    },
    error: (err) => {
      console.error('Error fetching specializations:', err); // Agar error aa raha hai, toh yahan show hoga (jaise 404, CORS)
    }
  });
    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser')|| '{}');
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE')|| '{}'); 
    this.currRole = this.currRole.replace(/"/g, '');

    // Get all doctors and store them for filtering
    this._service.getSlotListWithUniqueDoctors().subscribe(doctors => {
      this.allDoctors = doctors;
      this.filteredDoctors = doctors.map((doctor: Slots) => doctor.doctorname);
      this.doctors = new Observable<Slots[]>(observer => {
        observer.next(this.allDoctors);
        observer.complete();
      });
    });
    
    // Using hardcoded specializations in the HTML instead of fetching from service
    // this.specializations = this._service.getSlotListWithUniqueSpecializations();
    this.slots = this._service.getSlotList();
    
    this.showMessage = false;
    this.showForm = true;
  }

  getMinDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSpecializationChange() {
    // If no specialization is selected, hide the doctor dropdown
    if (!this.appointment.specialization || this.appointment.specialization === '') {
      // Reset doctor selection
      this.appointment.doctorname = '';
      return;
    }
    
    // Filter doctors based on selected specialization
    this._service.getSlotList().subscribe(slots => {
      const doctorsWithSpecialization = slots
        .filter((slot: Slots) => slot.specialization === this.appointment.specialization)
        .map((slot: Slots) => slot.doctorname);
      
      // Remove duplicates
      this.filteredDoctors = [...new Set(doctorsWithSpecialization)] as string[];
      
      // Reset doctor selection
      this.appointment.doctorname = '';
      
      // Update doctors observable
      this.doctors = new Observable<Slots[]>(observer => {
        observer.next(this.filteredDoctors.map(name => ({ doctorname: name } as Slots)));
        observer.complete();
      });
    });
  }
  
  onDoctorSelect() {
    if (this.appointment.doctorname && this.appointment.date) {
      // Reset slots when doctor changes
      this.appointment.slot = '';
      this.checkSlotAvailability();
    }
  }

  onDateChange() {
    if (this.appointment.doctorname && this.appointment.date) {
      // Reset slots when date changes
      this.appointment.slot = '';
      this.checkSlotAvailability();
    }
  }

  checkFinalSlotAvailability(slots: any[]): boolean {
    const doctorSlots = slots.find((slot: Slots) => 
      slot.doctorname === this.appointment.doctorname && 
      slot.date === this.appointment.date
    );

    if (!doctorSlots) return false; // Yeh false karo, taaki frontend bhi reject kare

    switch(this.appointment.slot) {
      case 'AM slot':
        return doctorSlots.amstatus === 'unbooked'; // Remove && doctorSlots.amslot === 'empty'
      case 'Noon slot':
        return doctorSlots.noonstatus === 'unbooked'; // Remove && doctorSlots.noonslot === 'empty'
      case 'PM slot':
        return doctorSlots.pmstatus === 'unbooked'; // Remove && doctorSlots.pmslot === 'empty'
      default:
        return false;
    }
  }

 checkSlotAvailability() {
    // Get all slots for the selected doctor on the selected date
    this._service.getSlotList().subscribe(slots => {
      const doctorSlots = slots.find((slot: Slots) => 
        slot.doctorname === this.appointment.doctorname && 
        slot.date === this.appointment.date
      );

      this.availableSlots = [];
      
      if (doctorSlots) {
        // Check AM slot
        if (doctorSlots.amstatus === 'unbooked') { // Remove && doctorSlots.amslot === 'empty'
          this.availableSlots.push('AM slot');
        }
        
        // Check Noon slot
        if (doctorSlots.noonstatus === 'unbooked') { // Remove && doctorSlots.noonslot === 'empty'
          this.availableSlots.push('Noon slot');
        }
        
        // Check PM slot
        if (doctorSlots.pmstatus === 'unbooked') { // Remove && doctorSlots.pmslot === 'empty'
          this.availableSlots.push('PM slot');
        }
      } else {
        // If no slots found for the date, NO slots are available (match backend behavior)
        this.availableSlots = [];
      }
    });
  }

  generatePatientId(): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    return `PAT${timestamp}${random}`;
  }

  validateAppointment(): { isValid: boolean, message: string } {
    if (!this.appointment.patientname?.trim()) {
      return { isValid: false, message: "Patient name is required" };
    }
    if (!this.appointment.email?.trim()) {
      return { isValid: false, message: "Email is required" };
    }
    if (!this.appointment.doctorname?.trim()) {
      return { isValid: false, message: "Doctor name is required" };
    }
    if (!this.appointment.specialization?.trim()) {
      return { isValid: false, message: "Specialization is required" };
    }
    if (!this.appointment.date?.trim()) {
      return { isValid: false, message: "Date is required" };
    }

    // Yeh add kiya: age ko parse karo taaki string se number bane
    const ageNum = parseInt(this.appointment.age as unknown as string, 10);  // Yeh assume kar raha hai ki age string hai, agar model mein number hai toh yeh hata do

    if (this.appointment.age == null || isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
      return { isValid: false, message: "Valid age is required (0-150)" };
    }
    if (!this.appointment.gender?.trim()) {
      return { isValid: false, message: "Gender is required" };
    }
    if (!this.appointment.problem?.trim()) {
      return { isValid: false, message: "Problem description is required" };
    }
    if (!this.appointment.slot?.trim()) {
      return { isValid: false, message: "Time slot is required" };
    }
    return { isValid: true, message: "" };
  }

  private handleBookingError(error: any) {
    console.error("Booking failed:", error);
    console.error("Error details:", error.message || error.error);
    this.isSubmitting = false;
    this.showForm = true;
    this.showMessage = true;
    
    if (error.status === 409) {
      this.message = "This slot has already been booked. Please select another slot.";
      this.checkSlotAvailability(); // Refresh available slots
    } else if (error.status === 400) {
      this.message = "Invalid appointment details. Please check all fields and try again.";
    } else {
      this.message = "There was a problem booking your appointment. Please try again later.";
    }
  }

  private retryBooking() {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`Retrying booking attempt ${this.retryCount}`);
      setTimeout(() => {
        this.bookAppointment();
      }, 1000); // Wait 1 second before retrying
    } else {
      this.handleBookingError({ status: 500, message: "Maximum retry attempts reached" });
    }
  }

  bookAppointment() {
  this.isSubmitting = true;
  this.showMessage = false;
  
  // Validate all required fields
  const validation = this.validateAppointment();
  if (!validation.isValid) {
    this.isSubmitting = false;
    this.showMessage = true;
    this.message = validation.message;
    return;
  }

  // Check slot availability one final time before booking
  this._service.getSlotList().subscribe({
    next: (slots) => {
      const slotAvailable = this.checkFinalSlotAvailability(slots);
      if (!slotAvailable) {
        this.isSubmitting = false;
        this.showMessage = true;
        this.message = "Sorry, this slot is no longer available. Please select another slot.";
        this.checkSlotAvailability(); // Refresh available slots
        return;
      }

      // Prepare appointment data (yeh yahan add/replace karo)
      const appointmentData = {
        ...this.appointment,
        appointmentstatus: 'false',
        admissionstatus: 'false',
        patientid: '' // Empty set karo, backend generate karega
      };

      // Attempt to book the appointment
      this.userService.addBookingAppointments(appointmentData).subscribe({
        next: (data) => {
          console.log("Appointment booked successfully");
          this.isSubmitting = false;
          this.showForm = false;
          this.showMessage = true;
          this.message = "Your appointment has been booked successfully! Appointment ID: " + data.patientid; // Ab backend se aane wala ID use karo
          this.retryCount = 0; // Reset retry counter
          
          setTimeout(() => {
            this._router.navigate(['/userdashboard']);
          }, 3000);
        },
        error: (error) => {
          if (error.status === 409 && this.retryCount < this.maxRetries) {
            // Retry on conflict (race condition)
            this.retryBooking();
          } else {
            this.handleBookingError(error);
          }
        }
      });
    },
    error: (error) => {
      this.handleBookingError(error);
    }
  });
<<<<<<< HEAD
}

=======
>>>>>>> cde3b3e98fa3a5d9179dcf168e64f30a62a4b031
}

}