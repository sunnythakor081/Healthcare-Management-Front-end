import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, of, tap } from 'rxjs';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Doctor } from '../../models/doctor';
import { User } from '../../models/user';
import { DoctorService } from '../../services/doctor.service';
import { Department } from '../../models/department';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent]
})
export class AdmindashboardComponent implements OnInit {

  name = 'admin';
  gender = '';
  loggedUser = '';
  currRole = '';
  patients: Observable<any[]> | undefined;
  users: Observable<any[]> | undefined;
  doctors: Observable<any[]> | undefined;
  slots: Observable<any[]> | undefined;
  appointments: Observable<any[]> | undefined;
  prescriptions: Observable<any[]> | undefined;
  isHeaderScrolled = false;

  
  // Loading states
  isLoading = false;
  loadingMessage = '';
  
  // Error handling
  errorMessage = '';
  showError = false;
  
  // Success handling
  successMessage = '';
  showSuccess = false;
  
  // Stats
  systemStats: any = {};
  
  // UI states
  isMobileMenuOpen = false;
  isDropdownOpen = false;
  
  // Department management
  departments: Observable<Department[]> | undefined;
  selectedDepartment: Department | null = null;

  constructor(
    private _route: Router, 
    private _service: UserService,
    private doctorService: DoctorService
  ) {
    // Add scroll event listener
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  ngOnDestroy() {
    // Remove scroll event listener
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  onScroll() {
    this.isHeaderScrolled = window.scrollY > 20;
  }

  ngOnInit(): void 
  {
    this.name = 'Admin';
    this.isLoading = true;
    this.loadingMessage = 'Loading dashboard data...';

    this.gender = JSON.stringify(sessionStorage.getItem('gender')|| '{}');
    this.gender = this.gender.replace(/"/g, '');

    this.loggedUser = JSON.stringify(sessionStorage.getItem('loggedUser')|| '{}');
    this.loggedUser = this.loggedUser.replace(/"/g, '');

    this.currRole = JSON.stringify(sessionStorage.getItem('ROLE')|| '{}'); 
    this.currRole = this.currRole.replace(/"/g, '');

    // Verify admin role
    if (this.currRole !== 'admin') {
      this.showError = true;
      this.errorMessage = 'Unauthorized access. Redirecting to login...';
      setTimeout(() => {
        this.logout();
      }, 2000);
      return;
    }

    // Load all dashboard data
    this.loadDashboardData();

    // Get system stats
    this.loadSystemStats();
    
    // Load departments
    this.loadDepartments();

    // Initialize jQuery components if needed
    setTimeout(() => {
      $('.menuToggle').on('click', function() {
        $(this).toggleClass('menuToggle_open');
        $(".menu").toggleClass('hideMenu');
      });
    }, 500);
  }

  /**
   * Load all dashboard data from services
   */
  loadDashboardData(): void {
    this.patients = this._service.getTotalPatients().pipe(
      catchError(error => {
        this.handleError('Failed to load patients data');
        return of([]);
      })
    );
    
    this.users = this._service.getTotalUsers().pipe(
      catchError(error => {
        this.handleError('Failed to load users data');
        return of([]);
      })
    );
    
    this.doctors = this._service.getTotalDoctors().pipe(
      catchError(error => {
        this.handleError('Failed to load doctors data');
        return of([]);
      })
    );
    
    this.slots = this._service.getTotalSlots().pipe(
      catchError(error => {
        this.handleError('Failed to load slots data');
        return of([]);
      })
    );
    
    this.appointments = this._service.getTotalAppointments().pipe(
      catchError(error => {
        this.handleError('Failed to load appointments data');
        return of([]);
      })
    );
    
    this.prescriptions = this._service.getTotalPrescriptions().pipe(
      catchError(error => {
        this.handleError('Failed to load prescriptions data');
        return of([]);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );
  }

  /**
   * Load system statistics
   */
  loadSystemStats(): void {
    this._service.getSystemStats().pipe(
      tap(stats => {
        this.systemStats = stats;
      }),
      catchError(error => {
        this.handleError('Failed to load system statistics');
        return of({});
      })
    ).subscribe();
  }

  /**
   * Logout the current admin user
   * Clears session storage and redirects to login page
   */
  logout(): void {
    // Clear all session storage items
    sessionStorage.clear();
    // Navigate to login page
    this._route.navigate(['/login']);
  }   

  /**
   * Approve a doctor application
   * @param doctorId The ID of the doctor to approve
   */
  approveDoctor(doctorId: number): void {
    this.isLoading = true;
    this.loadingMessage = 'Approving doctor...';
    
    this._service.approveDoctor(doctorId).pipe(
      tap(() => {
        this.showSuccess = true;
        this.successMessage = 'Doctor approved successfully';
        // Reload doctors list
        this.doctors = this._service.getTotalDoctors();
      }),
      catchError(error => {
        this.handleError('Failed to approve doctor');
        return of(null);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
  }

  /**
   * Reject a doctor application
   * @param doctorId The ID of the doctor to reject
   */
  rejectDoctor(doctorId: number): void {
    this.isLoading = true;
    this.loadingMessage = 'Rejecting doctor application...';
    
    this._service.rejectDoctor(doctorId).pipe(
      tap(() => {
        this.showSuccess = true;
        this.successMessage = 'Doctor application rejected';
        // Reload doctors list
        this.doctors = this._service.getTotalDoctors();
      }),
      catchError(error => {
        this.handleError('Failed to reject doctor application');
        return of(null);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
  }

  /**
   * Delete a user
   * @param userId The ID of the user to delete
   */
  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      this.isLoading = true;
      this.loadingMessage = 'Deleting user...';
      
      this._service.deleteUser(userId).pipe(
        tap(() => {
          this.showSuccess = true;
          this.successMessage = 'User deleted successfully';
          // Reload users list
          this.users = this._service.getTotalUsers();
          this.patients = this._service.getTotalPatients();
        }),
        catchError(error => {
          this.handleError('Failed to delete user');
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe();
    }
  }

  /**
   * Handle error messages
   * @param message Error message to display
   */
  private handleError(message: string): void {
    this.showError = true;
    this.errorMessage = message;
    setTimeout(() => {
      this.showError = false;
    }, 5000);
  }

  /**
   * Toggle mobile menu for responsive design
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isDropdownOpen = false;
    }
  }

  /**
   * Toggle dropdown menu
   */
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /**
   * Clear success message after timeout
   */
  clearSuccessMessage(): void {
    setTimeout(() => {
      this.showSuccess = false;
    }, 5000);
  }

  /**
   * Load departments
   */
  loadDepartments(): void {
    this.departments = this.doctorService.getDepartments().pipe(
      catchError(error => {
        this.handleError('Failed to load departments');
        return of([]);
      })
    );
  }

  /**
   * Add new department
   * @param department Department object
   */
  addDepartment(department: Department): void {
    this.isLoading = true;
    this.loadingMessage = 'Adding department...';
    
    this.doctorService.addDepartment(department).pipe(
      tap(newDepartment => {
        this.showSuccess = true;
        this.successMessage = 'Department added successfully';
        // Reload departments
        this.loadDepartments();
      }),
      catchError(error => {
        this.handleError('Failed to add department');
        return of(null);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe();
  }

  /**
   * Delete doctor
   * @param doctorId The ID of the doctor to delete
   */
  deleteDoctor(doctorId: number): void {
    if (confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      this.isLoading = true;
      this.loadingMessage = 'Deleting doctor...';
      
      this.doctorService.deleteDoctor(doctorId).pipe(
        tap(() => {
          this.showSuccess = true;
          this.successMessage = 'Doctor deleted successfully';
          // Reload doctors list
          this.doctors = this._service.getTotalDoctors();
        }),
        catchError(error => {
          this.handleError('Failed to delete doctor');
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      ).subscribe();
    }
  }

}
