import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Doctor } from '../../models/doctor';
import { DoctorService } from '../../services/doctor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-addingdoctor',
  templateUrl: './addingdoctor.component.html',
  styleUrls: ['./addingdoctor.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent]
})
export class AddingdoctorComponent implements OnInit {

  doctor = new Doctor();
  
  constructor(private _service: DoctorService, private _router: Router) { }

  ngOnInit(): void {
  }

  addDoctor() {
    this._service.addDoctorFromRemote(this.doctor).subscribe({
      next: (data) => {
        console.log("Doctor added successfully");
        this._router.navigate(['/admindashboard']);
      },
      error: (error) => {
        console.log("Process failed");
        console.error(error);
      }
    });
  }
}