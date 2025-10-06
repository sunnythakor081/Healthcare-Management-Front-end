import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
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
  doctor: Doctor = new Doctor;
  msg = ' ';
  currRole = '';
  loggedUser = '';
  temp = false;

  constructor(private _service: DoctorService, private activatedRoute: ActivatedRoute, private _router : Router) { }

  ngOnInit(): void 
  {
    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser')|| '{}');
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE')|| '{}'); 
    this.currRole = this.currRole.replace(/"/g, '');
    

    $("#profilecard").show();
    $("#profileform").hide();
    this.getProfileDetails(this.loggedUser);
  }

  editProfile()
  {
    $("#profilecard").hide();
    $("#profileform").show();
  }

  getProfileDetails(loggedUser : string)
  {
    
    this.profileDetails = this._service.getProfileDetails(this.loggedUser);
    console.log(this.profileDetails);
  }

  updateDoctorProfile()
  {
    this._service.UpdateDoctorProfile(this.doctor).subscribe(
      data => {
        console.log("UserProfile Updated succesfully");
        this.msg = "Profile Updated Successfully !!!";
        $(".editbtn").hide();
        $("#message").show();
        this.temp = true;
        $("#profilecard").show();
        $("#profileform").hide();
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
