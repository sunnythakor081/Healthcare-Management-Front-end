import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import jQuery from 'jquery';
const $ = jQuery;
import { Prescription } from '../../models/prescription';
import { UserService } from '../../services/user.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-prescriptionlist',
  templateUrl: './prescriptionlist.component.html',
  styleUrls: ['./prescriptionlist.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, NgxPaginationModule]
})
export class PrescriptionlistComponent implements OnInit {

  prescriptionlist: Observable<Prescription[]> | undefined;
  name: string = '';
  errorMessage: string = ''; // <-- New property for error

  constructor(private _service: UserService) { }

  ngOnInit(): void {
    $('#messagecard').show();
    $('#prescriptionpages').hide();
    this.errorMessage = ''; // Clear error on init
  }

  searchPrescription() {
    if (!this.name.trim()) {
      this.errorMessage = 'Please enter a patient name';
      $('#prescriptionpages').hide();
      return;
    }

    this.errorMessage = ''; // Clear previous error
    $('#messagecard').hide();
    $('#prescriptionpages').show();

    this.prescriptionlist = this._service.getPrescriptionsByName(this.name);
    this.prescriptionlist.subscribe({
      next: (prescriptions: Prescription[]) => {
        console.log('Prescriptions received:', prescriptions);
        if (prescriptions.length === 0) {
          this.errorMessage = 'Prescription not found for patient: ' + this.name;
        }
      },
      error: (err) => {
        console.error('Error fetching prescriptions:', err);
        this.errorMessage = 'Prescription not found or server error. Please try again.';
      }
    });
  }

  onPrint() {
    $("#printbtn").hide();
    $("#prescriptionpages").css('margin-top','6%');
    window.print();
    $("#printbtn").show(); // Show button again after print
  }
}