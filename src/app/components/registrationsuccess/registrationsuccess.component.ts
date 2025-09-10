import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-registrationsuccess',
  templateUrl: './registrationsuccess.component.html',
  styleUrls: ['./registrationsuccess.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class RegistrationsuccessComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void 
  {
    setTimeout(() => {
      this.router.navigate(['login']);
  }, 7000);
  }

}
