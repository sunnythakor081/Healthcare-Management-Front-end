import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-welcomepage',
  templateUrl: './welcomepage.component.html',
  styleUrls: ['./welcomepage.component.css'],
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, FormsModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class WelcomepageComponent implements OnInit {
  // Featured doctors data
  doctors = [
    {
      id: 1,
      name: 'Dr. John Smith',
      specialty: 'Cardiologist',
      experience: '15 years',
      availableToday: true,
      online: true,
      hours: '9:00 AM - 5:00 PM',
      image: 'https://images.unsplash.com/photo-1550831107-1553da8c8464?q=80&w=1200&auto=format&fit=crop',
      description: 'Specializes in heart and cardiovascular conditions with a focus on preventive care.'
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      specialty: 'Neurologist',
      experience: '12 years',
      availableToday: false,
      online: false,
      hours: '10:00 AM - 6:00 PM',
      image: 'https://images.unsplash.com/photo-1584982751630-4c1713e61d96?q=80&w=1200&auto=format&fit=crop',
      description: 'Expert in diagnosing and treating disorders of the nervous system including the brain and spinal cord.'
    },
    {
      id: 3,
      name: 'Dr. Michael Chen',
      specialty: 'Pediatrician',
      experience: '10 years',
      availableToday: true,
      online: true,
      hours: '8:00 AM - 4:00 PM',
      image: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=1200&auto=format&fit=crop',
      description: 'Dedicated to providing comprehensive healthcare for children from infancy through adolescence.'
    },
    {
      id: 4,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatologist',
      experience: '8 years',
      availableToday: true,
      online: true,
      hours: '9:30 AM - 5:30 PM',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=1200&auto=format&fit=crop',
      description: 'Specializes in conditions affecting the skin, hair, and nails with expertise in cosmetic procedures.'
    }
  ];

  // Services offered
  services = [
    {
      id: 1,
      title: 'Intensive Care',
      description: 'Specialized 24/7 monitoring and support for critical conditions with state-of-the-art equipment.',
      icon: 'fa-heartbeat',
      image: 'assets/img/intensive-care.svg'
    },
    {
      id: 2,
      title: 'Specialized Support',
      description: 'Expert care teams dedicated to specific medical conditions, providing personalized treatment plans.',
      icon: 'fa-user-md',
      image: 'assets/img/specialized-support.svg'
    },
    {
      id: 3,
      title: 'Medical & Surgical',
      description: 'Comprehensive medical treatments and surgical procedures performed by experienced specialists.',
      icon: 'fa-hospital-o',
      image: 'assets/img/medical-surgical.svg'
    },
    {
      id: 4,
      title: 'Emergency Care',
      description: 'Rapid response emergency services with immediate access to specialists for urgent medical situations.',
      icon: 'fa-medkit',
      image: 'assets/img/emergency-care.svg'
    },
    {
      id: 5,
      title: 'Preventive Care',
      description: 'Comprehensive health screenings and preventive services to maintain optimal health and detect issues early.',
      icon: 'fa-stethoscope',
      image: 'assets/img/preventive-care.svg'
    },
    {
      id: 6,
      title: 'Telemedicine',
      description: 'Virtual consultations with healthcare providers from the comfort of your home, available 24/7.',
      icon: 'fa-video-camera',
      image: 'assets/img/telemedicine.svg'
    }
  ];

  // Testimonials
  testimonials = [
    {
      id: 1,
      name: 'Emily Rodriguez',
      info: 'Patient since 2020',
      rating: 5,
      text: 'The healthcare management system has transformed how I manage my family\'s health. Scheduling appointments and accessing medical records has never been easier.',
      image: 'assets/img/patient1.svg'
    },
    {
      id: 2,
      name: 'Dr. Robert Williams',
      info: 'Family Physician',
      rating: 5,
      text: 'As a healthcare provider, this system has streamlined my practice. I can focus more on patient care rather than administrative tasks.',
      image: 'assets/img/doctor4.svg'
    },
    {
      id: 3,
      name: 'James Thompson',
      info: 'Patient since 2021',
      rating: 4.5,
      text: 'The telemedicine feature has been a lifesaver for me. I can consult with specialists without having to travel long distances.',
      image: 'assets/img/patient2.svg'
    }
  ];

  showHome = true;
  showLoginForm = false;
  showRegisterForm = false;

  loginData = {
    email: '',
    password: ''
  };

  registerData = {
    fullName: '',
    email: '',
    password: '',
    phone: ''
  };

  constructor(private activatedRoute: ActivatedRoute, private _router: Router) { }

  ngOnInit(): void {
    // Scroll to top when component initializes
    window.scrollTo(0, 0);
  }

  navigate(route: string = '/login'): void {
    this._router.navigate([route]);
  }

  bookAppointment(doctorId: number): void {
    // Navigate to appointment booking page with doctor ID
    this._router.navigate(['/bookappointment'], { queryParams: { doctorId: doctorId } });
  }

  // Helper method to generate star rating array for testimonials
  getStarArray(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = Array(fullStars).fill(1);
    
    if (hasHalfStar) {
      stars.push(0.5);
    }
    
    return stars;
  }

  showLogin() {
    this.showHome = false;
    this.showLoginForm = true;
    this.showRegisterForm = false;
  }

  showRegister() {
    this.showHome = false;
    this.showLoginForm = false;
    this.showRegisterForm = true;
  }

  showHomePage() {
    this.showHome = true;
    this.showLoginForm = false;
    this.showRegisterForm = false;
  }

  onLogin() {
    // Placeholder for login logic
    console.log('Login attempted:', this.loginData);
    alert('Login functionality will be implemented with backend integration');
  }

  onRegister() {
    // Placeholder for registration logic
    console.log('Registration attempted:', this.registerData);
    alert('Registration functionality will be implemented with backend integration');
  }
}
