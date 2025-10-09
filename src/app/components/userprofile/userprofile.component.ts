import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';  // Add Subscription if needed
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import jQuery from 'jquery';
const $ = jQuery;

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent]
})
export class UserprofileComponent implements OnInit {

  profileDetails: Observable<User> | undefined;  // Change to User (not User[])
  user: User = new User();
  msg = ' ';
  currRole = '';
  loggedUser = '';
  temp = false;

  constructor(private _service: UserService, private activatedRoute: ActivatedRoute, private _router: Router) { }

  ngOnInit(): void {
    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser') || '{}');
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE') || '{}');
    this.currRole = this.currRole.replace(/"/g, '');

    $("#profilecard").show();
    $("#profileform").hide();
    this.getProfileDetails(this.loggedUser);
  }

  editProfile() {
    $("#profilecard").hide();
    $("#profileform").show();
  }

  getProfileDetails(loggedUser: string) {
    this.profileDetails = this._service.getProfileDetails(this.loggedUser);
    this.profileDetails.subscribe(  // Subscribe here to populate this.user
      (data: User) => {
        this.user = data;  // Set the fetched user to this.user for form binding
        console.log('Profile data loaded:', this.user);  // Log for debugging
      },
      (error) => {
        console.error('Error fetching profile:', error);
      }
    );
  }

  updateUserProfile() {
    this._service.UpdateUserProfile(this.user).subscribe(  // Pass this.user.id in the next step
      (data: any) => {
        console.log("UserProfile Updated successfully");
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
      (error: any) => {
        console.log("Profile Updation Failed");
        console.log(error.error);
        this.msg = "Profile Updation Failed !!!";
      }
    );
  }
}