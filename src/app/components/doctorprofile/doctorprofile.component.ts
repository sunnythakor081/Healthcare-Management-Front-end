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

  profileDetails: Observable<Doctor> | undefined; // FIXED: Single Doctor (not array)
  doctor: Doctor = new Doctor();
  msg = ' ';
  currRole = '';
  loggedUser = '';
  temp = false;
  private subscription: Subscription | undefined;

  constructor(private _service: DoctorService, private activatedRoute: ActivatedRoute, private _router: Router) { }

  ngOnInit(): void {
    // FIXED: Safer parsing (no JSON.stringify - direct getItem)
    const rawLoggedUser = sessionStorage.getItem('loggedUser');
    if (!rawLoggedUser) {
      console.error('No loggedUser - redirect to login');
      this._router.navigate(['/login']);
      return;
    }
    this.loggedUser = rawLoggedUser.replace(/"/g, ''); // Clean quotes if any
    console.log('Raw loggedUser from session:', rawLoggedUser);
    console.log('Component: Parsed loggedUser:', this.loggedUser); // e.g., "devanshi@gmail.com"

    const rawRole = sessionStorage.getItem('ROLE');
    if (rawRole) {
      this.currRole = rawRole.replace(/"/g, '');
    }

    $("#profilecard").show();
    $("#profileform").hide();
    this.getProfileDetails();  // Fetch single Doctor from backend
    this.fetchDoctorId();  // Optional for ID
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

  cancelEdit() {
    $("#profilecard").show();
    $("#profileform").hide();
  }

  // FIXED: Single Doctor handling (no length/[0] - direct assign)
  getProfileDetails() {
    this.profileDetails = this._service.getProfileDetails(this.loggedUser);
    this.subscription = this.profileDetails.subscribe({
      next: (data: Doctor) => { // FIXED: Single Doctor (not Doctor[])
        console.log('Component: Full fetched Doctor:', data);  // Single object log
        console.log('Component: Key fields:', { // Log all fields for debug
          id: data.id,
          name: data.doctorname,
          email: data.email,
          gender: data.gender,
          mobile: data.mobile,
          experience: data.experience,
          specialization: data.specialization,
          previoushospital: data.previoushospital,
          address: data.address,
          status: data.status
        });
        if (data && data.doctorname && data.doctorname.trim() !== '') { // Valid check (trim for safety)
          this.doctor = { ...data }; // Direct clone/assign - all fields copied
          this.doctor.email = this.loggedUser; // Ensure email
          console.log('Component: Assigned to this.doctor:', this.doctor);  // Full assigned object
        } else {
          console.warn('Component: Empty/invalid Doctor for:', this.loggedUser);
          this.doctor = new Doctor(); // Empty fallback
          this.msg = 'No profile data found in database. Create one?';
        }
      },
      error: (err) => {
        console.error('Component: Fetch error:', err);
        this.msg = 'Failed to fetch profile from DB.';
        this.doctor = new Doctor();
      }
    });
  }

  fetchDoctorId() {
    this._service.getDoctorListByEmail(this.loggedUser).subscribe({
      next: (data: any) => {
        console.log('Doctor list by email:', data);
        if (data && data.length > 0) {
          this.doctor.id = data[0].id || undefined; // Fallback if no id
          console.log('Set ID from list:', this.doctor.id);
        }
      },
      error: (err) => {
        console.error('Error fetching doctor ID:', err);
      }
    });
  }

  updateDoctorProfile() {
    console.log('Full doctor object before update:', this.doctor);
    console.log('Sending doctor for update, ID:', this.doctor.id);
    this._service.updateDoctorProfile(this.doctor).subscribe(
      data => {
        console.log("Profile Updated successfully");
        this.msg = "Profile Updated Successfully !!!";
        $(".editbtn").hide();
        $("#message").show();
        this.temp = true;
        $("#profilecard").show();
        $("#profileform").hide();
        this.getProfileDetails();  // Refresh single from backend
        setTimeout(() => {
          this._router.navigate(['/userdashboard']);
        }, 6000);
      },
      error => {
        console.log("Profile Updation Failed");
        console.log('Full error:', error);
        this.msg = "Profile Updation Failed !!!";
      }
    );
  }
}