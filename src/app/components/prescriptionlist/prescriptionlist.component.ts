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

  prescriptionlist : Observable<Prescription[]> | undefined;
  name : string = '';

  constructor(private _service : UserService) { }

  ngOnInit(): void 
  {
    
    $('#messagecard').show();
    $('#prescriptionpages').hide();

  }

  searchPrescription()
  {
    this.prescriptionlist = this._service.getPrescriptionsByName(this.name);
    $('#messagecard').hide();
    $('#prescriptionpages').show();
  }

  onPrint()
  {
    $("#printbtn").hide();
    $("#prescriptionpages").css('margin-top','6%');
    window.print();
  }

}
