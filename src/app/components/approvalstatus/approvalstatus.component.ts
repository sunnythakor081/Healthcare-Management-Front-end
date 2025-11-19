import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../../models/appointment';
import { Doctor } from '../../models/doctor';
import { DoctorService } from '../../services/doctor.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-approvalstatus',
  templateUrl: './approvalstatus.component.html',
  styleUrls: ['./approvalstatus.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent]
})
export class ApprovalstatusComponent implements OnInit {

  currRole = '';
  loggedUser = '';
  mail = '';
  approval: Observable<Doctor[]> | undefined;
  appointment: Observable<Appointment[]> | undefined;
  showSearchForm = true;

  constructor(private _service: DoctorService) { }

  ngOnInit(): void {
    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser') || '{}');
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE') || '{}');
    this.currRole = this.currRole.replace(/"/g, '');

    if (this.currRole === 'doctor' || this.currRole === 'DOCTOR') {
      this.approval = this._service.getDoctorListByEmail(this.loggedUser);
    } else if (this.currRole === 'user' || this.currRole === 'USER') {
      this.showSearchForm = true;
    }
  }

  searchPatient() {
    if (this.mail) {
      this.appointment = this._service.getPatientListByEmail(this.mail);
      this.showSearchForm = false;
    }
  }
}