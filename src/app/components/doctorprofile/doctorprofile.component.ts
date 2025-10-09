import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Doctor } from '../../models/doctor';
import { DoctorService } from '../../services/doctor.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctorprofile',
  templateUrl: './doctorprofile.component.html',
  styleUrls: ['./doctorprofile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent]
})
export class DoctorprofileComponent implements OnInit {

  profileDetails : Observable<Doctor[]> | undefined;
  doctor: Doctor = new Doctor();
  msg = ' ';
  currRole = '';
  loggedUser = '';
  temp = false;
  private subscription: Subscription | undefined;

  constructor(private _service: DoctorService, private activatedRoute: ActivatedRoute, private _router : Router) { }

  ngOnInit(): void 
  {
    this.loggedUser = sessionStorage.getItem('loggedUser') || '';
    this.currRole = sessionStorage.getItem('ROLE') || ''; 

    $("#profilecard").show();
    $("#profileform").hide();
    this.getProfileDetails();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  editProfile()
  {
    $("#profilecard").hide();
    $("#profileform").show();
  }

  getProfileDetails()
  {
    this.profileDetails = this._service.getProfileDetails(this.loggedUser);
    this.subscription = this.profileDetails.subscribe({
      next: (data: Doctor[]) => {
        if (data && data.length > 0) {
          this.doctor = { ...data[0] }; // Clone the fetched doctor data to pre-fill the form
          this.doctor.email = this.loggedUser; // Ensure email is set but not editable
           // Do not include password
        }
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
      }
    });
  }

  updateDoctorProfile()
  {
    this._service.updateDoctorProfile(this.doctor).subscribe(
      data => {
        console.log("Profile Updated successfully");
        this.msg = "Profile Updated Successfully !!!";
        $(".editbtn").hide();
        $("#message").show();
        this.temp = true;
        $("#profilecard").show();
        $("#profileform").hide();
        // Refresh the profile data after update
        this.getProfileDetails();
        setTimeout(() => {
            this._router.navigate(['/userdashboard']);
          }, 6000);
      },
      error => {
        console.log("Profile Updation Failed");
        console.log(error.error);
        this.msg = "Profile Updation Failed !!!";
      }
    )
  }
}