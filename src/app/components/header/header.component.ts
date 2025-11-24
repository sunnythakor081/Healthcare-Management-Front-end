import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class HeaderComponent implements OnInit {
  loggedUser = '';
  currRole = '';
  isMobileMenuOpen = false;
  isDropdownOpen = false;
  isRegistrationPage = false;

  constructor(private _router: Router) { }

  ngOnInit(): void {
    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser')|| '{}');
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE')|| '{}'); 
    this.currRole = this.currRole.replace(/"/g, '');

    // Check if current route is registration page
    this.isRegistrationPage = this._router.url.includes('/registration');
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  logout() {
    sessionStorage.removeItem('loggedUser');
    sessionStorage.removeItem('ROLE');
    this.loggedUser = '';
    this.currRole = '';
    this._router.navigate(['/']);
  }
  
  navigateHome(): void {
    if(this.loggedUser && this.loggedUser === "admin@gmail.com"){
      this._router.navigate(['/admindashboard']);
    }
    else if(this.currRole && this.currRole === "doctor"){
      this._router.navigate(['/doctordashboard']);
    }
    else if(this.currRole && this.currRole === "user"){
      this._router.navigate(['/userdashboard']);
    }
    else {
      this._router.navigate(['/']);
    }
  }

}
