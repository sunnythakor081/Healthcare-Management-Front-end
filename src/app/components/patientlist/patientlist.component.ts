import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Appointment } from '../../models/appointment';
import { Doctor } from '../../models/doctor';
import { Slots } from '../../models/slots';
import { DoctorService } from '../../services/doctor.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-patientlist',
  templateUrl: './patientlist.component.html',
  styleUrls: ['./patientlist.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, NgxPaginationModule]
})
export class PatientlistComponent implements OnInit {

  currRole = '';
  loggedUser = '';
  patients : Observable<Appointment[]> | undefined;
  slots : Observable<Slots[]> | undefined;
  responses : Observable<any> | undefined;
  page: number = 1; // For pagination

  constructor(private _service : DoctorService) { }

  ngOnInit(): void
  {
    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser')|| '{}');
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE')|| '{}'); 
    this.currRole = this.currRole.replace(/"/g, '');

    if(this.currRole === "user")
    {
      this.patients = this._service.getPatientListByDoctorEmail(this.loggedUser);
    }
    else
    {
      this.patients = this._service.getPatientList();
    }
    this.slots = this._service.getSlotDetails(this.loggedUser);
  }

  acceptRequest(slot : string)
  {
    this.responses = this._service.acceptRequestForPatientApproval(slot);
    $("#acceptbtn").addClass('hidden');
    $("#rejectbtn").addClass('hidden');
    $("#acceptedbtn").removeClass('hidden');
    $("#rejectedbtn").addClass('hidden');
  }

  rejectRequest(slot : string)
  {
    this.responses = this._service.rejectRequestForPatientApproval(slot);
    $("#acceptbtn").addClass('hidden');
    $("#rejectbtn").addClass('hidden');
    $("#acceptedbtn").addClass('hidden');
    $("#rejectedbtn").removeClass('hidden');
  }


}
