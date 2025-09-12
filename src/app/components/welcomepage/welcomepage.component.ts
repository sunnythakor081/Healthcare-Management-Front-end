import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-welcomepage',
  templateUrl: './welcomepage.component.html',
  styleUrls: ['./welcomepage.component.css'],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('600ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideInRight', [
      state('void', style({ opacity: 0, transform: 'translateX(30px)' })),
      transition(':enter', [
        animate('600ms ease-in', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInLeft', [
      state('void', style({ opacity: 0, transform: 'translateX(-30px)' })),
      transition(':enter', [
        animate('600ms ease-in', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInUp', [
      state('void', style({ opacity: 0, transform: 'translateY(30px)' })),
      transition(':enter', [
        animate('600ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('pulse', [
      state('normal', style({ transform: 'scale(1)' })),
      state('pulsed', style({ transform: 'scale(1.05)' })),
      transition('normal <=> pulsed', animate('300ms ease-in-out'))
    ])
  ]
})
export class WelcomepageComponent implements OnInit {
  // Navigation and UI state
  isMobileMenuOpen = false;
  showLoginModal = false;
  showRegisterModal = false;
  showPassword = false;
  showRegisterPassword = false;
  isScrolled = false;
  currentYear = new Date().getFullYear();
  pulseState = 'normal';
  
  // Form groups
  appointmentForm!: FormGroup;
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  
  // Data for time slots
  timeSlots: string[] = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM'
  ];
  
  // Services data
  services = [
    {
      icon: 'fa-heartbeat',
      title: 'Cardiology',
      description: 'Comprehensive heart care with advanced diagnostic and treatment options.'
    },
    {
      icon: 'fa-brain',
      title: 'Neurology',
      description: 'Expert care for conditions affecting the brain, spine, and nervous system.'
    },
    {
      icon: 'fa-tooth',
      title: 'Dental Care',
      description: 'Complete dental services from routine check-ups to advanced procedures.'
    },
    {
      icon: 'fa-bone',
      title: 'Orthopedics',
      description: 'Specialized care for bones, joints, ligaments, tendons, and muscles.'
    },
    {
      icon: 'fa-eye',
      title: 'Ophthalmology',
      description: 'Comprehensive eye care services and treatments for all ages.'
    },
    {
      icon: 'fa-stethoscope',
      title: 'General Health',
      description: 'Preventive care and treatment for overall health and wellness.'
    }
  ];
  
  // Featured doctors data
  featuredDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      image: 'assets/img/doctor1-real.svg',
      rating: 4.9,
      experience: '15+ Years',
      patients: '10,000+',
      bio: 'Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating complex heart conditions. She specializes in preventive cardiology and heart health management.',
      available: true
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Neurologist',
      image: 'assets/img/doctor2-real.svg',
      rating: 4.8,
      experience: '12+ Years',
      patients: '8,000+',
      bio: 'Dr. Michael Chen specializes in neurological disorders and has pioneered several innovative treatment approaches. He is known for his patient-centered approach.',
      available: false
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrician',
      image: 'assets/img/doctor3-real.svg',
      rating: 4.9,
      experience: '10+ Years',
      patients: '12,000+',
      bio: 'Dr. Emily Rodriguez is dedicated to providing compassionate care for children of all ages. She focuses on developmental pediatrics and preventive healthcare for children.',
      available: true
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Orthopedic Surgeon',
      image: 'assets/img/doctor4-real.svg',
      rating: 4.7,
      experience: '14+ Years',
      patients: '7,500+',
      bio: 'Dr. James Wilson is an expert in joint replacement and sports medicine. He specializes in minimally invasive procedures with excellent outcomes.',
      available: true
    }
  ];
  
  // Testimonials data
  testimonials = [
    {
      id: 1,
      name: 'Emily Rodriguez',
      info: 'Patient since 2020',
      rating: 5,
      text: 'The healthcare management system has transformed how I manage my family\'s health. Scheduling appointments and accessing medical records has never been easier. The online portal makes managing my care so much easier.',
      image: 'assets/img/patient1.svg',
      date: 'May 15, 2023'
    },
    {
      id: 2,
      name: 'Dr. Robert Williams',
      info: 'Family Physician',
      rating: 5,
      text: 'As a healthcare provider, this system has streamlined my practice. I can focus more on patient care rather than administrative tasks. The telemedicine option for follow-up appointments saved my patients so much time and was just as effective.',
      image: 'assets/img/doctor4.svg',
      date: 'June 22, 2023'
    },
    {
      id: 3,
      name: 'James Thompson',
      info: 'Patient since 2021',
      rating: 4.5,
      text: 'The telemedicine feature has been a lifesaver for me. I can consult with specialists without having to travel long distances.',
      image: 'assets/img/patient2.svg',
      date: 'July 8, 2023'
    },
    {
      id: 4,
      name: 'Sarah Williams',
      info: 'Chronic Care Patient',
      rating: 5,
      text: 'As someone with chronic health issues, finding MediCare has been life-changing. The doctors listen to my concerns and work with me to develop comprehensive treatment plans. The online portal makes managing my care so much easier.',
      image: 'assets/img/femaleuser.png',
      date: 'August 3, 2023'
    },
    {
      id: 5,
      name: 'David Chen',
      info: 'Parent of Pediatric Patients',
      rating: 5,
      text: 'The pediatric care for my children has been outstanding. Dr. Rodriguez is amazing with kids and puts them at ease immediately. The colorful, welcoming environment makes doctor visits something my children actually look forward to!',
      image: 'assets/img/maleuser.png',
      date: 'September 12, 2023'
    }
  ];

  constructor(
    private _router: Router,
    private fb: FormBuilder
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    // Scroll to top when component initializes
    window.scrollTo(0, 0);
    
    // Initialize current year for footer
    this.currentYear = new Date().getFullYear();
  }

  // Listen for window scroll events
  @HostListener('window:scroll')
  onWindowScroll(): void {
    // Check if page is scrolled
    this.isScrolled = window.scrollY > 50;
    
    // Animate CTA button
    if (window.scrollY > 300 && window.scrollY < 1000) {
      this.pulseState = 'pulsed';
      setTimeout(() => {
        this.pulseState = 'normal';
      }, 500);
    }
  }

  // Initialize all forms
  initForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
    
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      address: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });
    
    this.appointmentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      date: ['', Validators.required],
      time: ['', Validators.required],
      department: ['', Validators.required],
      message: ['', Validators.maxLength(500)]
    });
  }
  
  // Password match validator
  passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { mismatch: true };
  }
  
  // Toggle mobile menu
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  // Modal controls
  openLoginModal(): void {
    this.showLoginModal = true;
    document.body.style.overflow = 'hidden';
  }
  
  openRegisterModal(): void {
    this.showRegisterModal = true;
    document.body.style.overflow = 'hidden';
  }
  
  showLogin(): void {
    this.showLoginModal = true;
    this.showRegisterModal = false;
    document.body.style.overflow = 'hidden';
  }
  
  showRegister(): void {
    this.showLoginModal = false;
    this.showRegisterModal = true;
    document.body.style.overflow = 'hidden';
  }
  
  closeModals(): void {
    this.showLoginModal = false;
    this.showRegisterModal = false;
    document.body.style.overflow = 'auto';
  }
  
  // Switch between login roles
  setLoginRole(role: string): void {
    // Implementation will be added later
  }
  
  // Switch between register roles
  setRegisterRole(role: string): void {
    // Implementation will be added later
  }
  
  navigate(route: string = '/login'): void {
    this._router.navigate([route]);
  }

  // Navigation methods for main actions
  navigateToLogin(): void {
    this._router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this._router.navigate(['/registration']);
  }

  navigateToAppointment(): void {
    this._router.navigate(['/bookappointment']);
  }

  // Method to handle navigation to appointment booking page
  navigateToBooking(doctorId: number): void {
    // Navigate to appointment booking page with doctor ID
    this._router.navigate(['/bookappointment'], { queryParams: { doctorId: doctorId } });
    
    // Pre-select the doctor in the appointment form
    const doctor = this.featuredDoctors.find(d => d.id === doctorId);
    if (doctor) {
      this.selectDepartment(doctor.specialty);
    }
  }
  
  selectDepartment(specialty: string) {
    // Find the matching department in the dropdown and select it
    this.appointmentForm.patchValue({
      department: specialty
    });
    
    // Focus on the next field after department selection
    setTimeout(() => {
      const messageElement = document.getElementById('message');
      if (messageElement) {
        messageElement.focus();
      }
    }, 100);
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
  
  // Helper method to mark all controls as touched
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
