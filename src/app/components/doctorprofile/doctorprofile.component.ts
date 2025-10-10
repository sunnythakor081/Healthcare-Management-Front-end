import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Doctor } from '../../models/doctor';
import { DoctorService } from '../../services/doctor.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jQuery from 'jquery';
const $ = jQuery;

@Component({
  selector: 'app-doctorprofile',
  templateUrl: './doctorprofile.component.html',
  styleUrls: ['./doctorprofile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent]
})
export class DoctorprofileComponent implements OnInit, OnDestroy {

  profileDetails: Observable<Doctor[]> | undefined;
  doctor: Doctor = new Doctor();
  msg = ' ';
  currRole = '';
  loggedUser = '';
  temp = false;
  private subscription: Subscription | undefined;

  constructor(private _service: DoctorService, private activatedRoute: ActivatedRoute, private _router: Router) { }

  ngOnInit(): void {
    // Existing parsing (user jaisa)
    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser') || '{}');
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE') || '{}');
    this.currRole = this.currRole.replace(/"/g, '');

    console.log('Raw loggedUser from session:', sessionStorage.getItem('loggedUser'));  // Add yeh line yahaan (debug ke liye)

    $("#profilecard").show();
    $("#profileform").hide();
    this.getProfileDetails();  // Existing call

    this.fetchDoctorId();  // Add new method call yahaan (end mein)
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  editProfile() {
    $("#profilecard").hide();
    $("#profileform").show();
  }

  getProfileDetails() {
    this.profileDetails = this._service.getProfileDetails(this.loggedUser);
    this.subscription = this.profileDetails.subscribe({
      next: (data: Doctor[]) => {
        console.log('Full fetched data:', data);  // Add: Full array log
        console.log('Data length:', data.length);  // Add: Length check
        if (data && data.length > 0) {
          console.log('First doctor full object:', data[0]);  // Add: Full first object
          this.doctor = { ...data[0] };
          this.doctor.email = this.loggedUser;
          console.log('Cloned doctor ID:', this.doctor.id);  // Existing log
        } else {
          console.warn('No doctor data found for email:', this.loggedUser);  // Existing
        }
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      }
    });
  }

  fetchDoctorId() {  // Add yeh pura method class mein
    this._service.getDoctorListByEmail(this.loggedUser).subscribe({
      next: (data: any) => {
        console.log('Doctor list by email:', data);
        if (data && data.length > 0) {
          this.doctor.id = data[0].id;  // Set ID from this endpoint
          console.log('Set ID from list:', this.doctor.id);
        }
      },
      error: (err) => {
        console.error('Error fetching doctor ID:', err);
      }
    });
  }

  updateDoctorProfile() {
    console.log('Full doctor object before update:', this.doctor);  // Add: Full object log
    console.log('Sending doctor for update, ID:', this.doctor.id);
    // ID check remove kiya - backend email se handle karega
    this._service.updateDoctorProfile(this.doctor).subscribe(
      data => {
        console.log("Profile Updated successfully");
        this.msg = "Profile Updated Successfully !!!";
        $(".editbtn").hide();
        $("#message").show();
        this.temp = true;
        $("#profilecard").show();
        $("#profileform").hide();
        this.getProfileDetails();  // Refresh
        setTimeout(() => {
          this._router.navigate(['/userdashboard']);
        }, 6000);
      },
      error => {
        console.log("Profile Updation Failed");
        console.log('Full error:', error);  // Better logging
        this.msg = "Profile Updation Failed !!!";
      }
    );
  }
}