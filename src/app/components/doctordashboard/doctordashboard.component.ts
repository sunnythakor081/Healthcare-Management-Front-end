import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-doctordashboard',
  templateUrl: './doctordashboard.component.html',
  styleUrls: ['./doctordashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent, HeaderComponent]
})
export class DoctordashboardComponent implements OnInit {
  name = '';
  gender = '';
  loggedUser = '';
  currRole = '';
  patients: Observable<any[]> | undefined;
  users: Observable<any[]> | undefined;
  doctors: Observable<any[]> | undefined;
  slots: Observable<any[]> | undefined;
  prescriptions: Observable<any[]> | undefined;

  constructor(private _route: Router, private _service: UserService) {}

  logout(): void {
    sessionStorage.clear();
    this._route.navigate(['/login']);
  }

  ngOnInit(): void {
    this.name = JSON.stringify(sessionStorage.getItem('doctorname') || '{}');
    this.name = this.name.replace(/"/g, '');

    this.gender = JSON.stringify(sessionStorage.getItem('gender') || '{}');
    this.gender = this.gender.replace(/"/g, '');

    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser') || '{}');
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE') || '{}');
    this.currRole = this.currRole.replace(/"/g, '');

    this.patients = this._service.getTotalPatients();
    this.users = this._service.getTotalUsers();
    this.doctors = this._service.getTotalDoctors();
    this.slots = this._service.getTotalSlots();
    this.prescriptions = this._service.getTotalPrescriptions();
  }
}