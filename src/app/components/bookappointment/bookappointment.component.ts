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
  
  constructor(private _service : DoctorService, private _router: Router, private userService : UserService) { }

  ngOnInit(): void
  {
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
  
  bookAppointment()
  {
    this.isSubmitting = true;
    
    // Set default values for backend fields
    this.appointment.appointmentstatus = 'false';
    this.appointment.admissionstatus = 'false';
    
    this.userService.addBookingAppointments(this.appointment).subscribe(
      data => {
        console.log("appointment booked Successfully");
        this.isSubmitting = false;
        this._router.navigate(['/userdashboard']);
      },
      error => {
        console.log("process Failed");
        this.isSubmitting = false;
        this.showForm = false;
        this.showMessage = true;
        this.message = "There is a problem in Booking Your Appointment, Please check slot availability and try again !!!";
        console.log(error.error);
      }
    )
  }
}
