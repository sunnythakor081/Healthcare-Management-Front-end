import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import jQuery from 'jquery';
const $ = jQuery;
import { Doctor } from '../../models/doctor';
import { User } from '../../models/user';
import { DoctorService } from '../../services/doctor.service';
import { RegistrationService } from '../../services/registration.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RegistrationComponent implements OnInit {

  user = new User();
  doctor = new Doctor();
   msg = ' ';
  
  activeTab: 'patient' | 'doctor' = 'patient';

  selectTab(tab: 'patient' | 'doctor') {
    this.activeTab = tab;
  }

  constructor(private _registrationService : RegistrationService, private _doctorService : DoctorService, private _router : Router) { }

  ngOnInit(): void 
  {
    $(".nav1").addClass("highlight1")
    $("#home-tab").click(function(){
      $("#profile").hide();
      $("#home").show();
      $(".nav1").addClass("highlight1")
      $(".nav2").removeClass("highlight2")
    });
    $("#profile-tab").click(function(){
      $("#home").hide();
      $("#profile").show();
      $(".nav2").addClass("highlight2")
      $(".nav1").removeClass("highlight1")
    });
  }

  registerUser()
  {
    this._registrationService.registerUserFromRemote(this.user).subscribe(
      data => {
        console.log("Registration Success");
        sessionStorage.setItem("username",this.user.username);
        sessionStorage.setItem("gender",this.user.gender);
        this._router.navigate(['/registrationsuccess']);
      },
      error => {
        console.log("Registration Failed");
        console.log(error.error);
        this.msg = "User with "+this.user.email+" already exists !!!";
      }
    )
  }

  registerDoctor()
  {
    this._registrationService.registerDoctorFromRemote(this.doctor).subscribe(
      data => {
        console.log("Registration Success");
        sessionStorage.setItem("doctorname",this.doctor.doctorname);
        sessionStorage.setItem("gender",this.doctor.gender);
        this._router.navigate(['/registrationsuccess']);
      },
      error => {
        console.log("Registration Failed");
        console.log(error.error);
        this.msg = "Doctor with "+this.user.email+" already exists !!!";
      }
    )
  }

}
