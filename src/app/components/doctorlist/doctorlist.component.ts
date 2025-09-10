import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from '../../models/doctor';
import { DoctorService } from '../../services/doctor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-doctorlist',
  templateUrl: './doctorlist.component.html',
  styleUrls: ['./doctorlist.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent, NgxPaginationModule]
})
export class DoctorlistComponent implements OnInit {

  doctors: Observable<Doctor[]> | undefined;
  filteredDoctors: Doctor[] = [];
  allDoctors: Doctor[] = [];
  isLoading = true;
  
  // Search and filter properties
  searchTerm = '';
  selectedSpecialization = '';
  selectedStatus = '';
  selectedGender = '';
  specializations: string[] = [];
  
  // Pagination properties
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 1;

  constructor(private _service: DoctorService) { }

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors() {
    this.isLoading = true;
    this.doctors = this._service.getDoctorList();
    this.doctors.subscribe(
      (doctors: Doctor[]) => {
        this.allDoctors = doctors;
        this.filteredDoctors = doctors;
        this.extractSpecializations();
        this.calculatePagination();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading doctors:', error);
        this.isLoading = false;
      }
    );
  }

  extractSpecializations() {
    const specs = new Set<string>();
    this.allDoctors.forEach(doctor => {
      if (doctor.specialization) {
        specs.add(doctor.specialization);
      }
    });
    this.specializations = Array.from(specs).sort();
  }

  filterDoctors() {
    let filtered = this.allDoctors;

    // Search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(doctor =>
        doctor.doctorname?.toLowerCase().includes(searchLower) ||
        doctor.specialization?.toLowerCase().includes(searchLower) ||
        doctor.experience?.toString().includes(searchLower)
      );
    }

    // Specialization filter
    if (this.selectedSpecialization) {
      filtered = filtered.filter(doctor => 
        doctor.specialization === this.selectedSpecialization
      );
    }

    // Status filter
    if (this.selectedStatus) {
      filtered = filtered.filter(doctor => 
        doctor.status === this.selectedStatus
      );
    }

    // Gender filter
    if (this.selectedGender) {
      filtered = filtered.filter(doctor => 
        doctor.gender === this.selectedGender
      );
    }

    this.filteredDoctors = filtered;
    this.currentPage = 1;
    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredDoctors.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  getPaginatedDoctors(): Doctor[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredDoctors.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Statistics methods
  getApprovedDoctorsCount(): number {
    return this.allDoctors.filter(doctor => doctor.status === 'accept').length;
  }

  getSpecializationsCount(): number {
    return this.specializations.length;
  }

  // Status helper methods
  getStatusClass(status: string): string {
    switch (status) {
      case 'accept': return 'status-approved';
      case 'false': return 'status-pending';
      case 'reject': return 'status-rejected';
      default: return 'status-unknown';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'accept': return 'fa-check-circle';
      case 'false': return 'fa-clock-o';
      case 'reject': return 'fa-times-circle';
      default: return 'fa-question-circle';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'accept': return 'Approved';
      case 'false': return 'Pending';
      case 'reject': return 'Rejected';
      default: return 'Unknown';
    }
  }

  // Action methods
  viewDoctorProfile(doctor: Doctor) {
    // TODO: Implement doctor profile view
    console.log('Viewing profile for:', doctor.doctorname);
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedSpecialization = '';
    this.selectedStatus = '';
    this.selectedGender = '';
    this.filterDoctors();
  }
}
