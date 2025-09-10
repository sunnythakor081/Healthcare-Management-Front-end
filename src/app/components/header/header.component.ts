import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
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
  title = 'HealthCare';
  isMobileMenuOpen = false;
  isDropdownOpen = false;

  constructor(private activatedRoute: ActivatedRoute, private _router : Router) { }

  ngOnInit(): void 
  {
    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser')|| '{}');
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE')|| '{}'); 
    this.currRole = this.currRole.replace(/"/g, '');

    // Set title based on current route
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateTitleBasedOnRoute(event.url);
      }
    });
    
    // Initial title setting
    this.updateTitleBasedOnRoute(this._router.url);
  }
  
  updateTitleBasedOnRoute(url: string): void {
    if (url === '/' || url === '') {
      this.title = 'HealthCare';
    } else if (url.includes('/login')) {
      this.title = 'Login';
    } else if (url.includes('/registration')) {
      this.title = 'Registration';
    } else if (url.includes('/admindashboard')) {
      this.title = 'Admin Dashboard';
    } else if (url.includes('/doctordashboard')) {
      this.title = 'Doctor Dashboard';
    } else if (url.includes('/userdashboard')) {
      this.title = 'User Dashboard';
    } else if (url.includes('/doctors')) {
      this.title = 'Our Doctors';
    } else if (url.includes('/appointments')) {
      this.title = 'Appointments';
    } else if (url.includes('/about')) {
      this.title = 'About Us';
    } else if (url.includes('/contact')) {
      this.title = 'Contact Us';
    }
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
