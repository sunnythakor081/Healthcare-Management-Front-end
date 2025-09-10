import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EditUserProfileComponent } from './edituserprofile.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { UserService } from '../../services/user.service';
import { of } from 'rxjs';

describe('EditUserProfileComponent', () => {
  let component: EditUserProfileComponent;
  let fixture: ComponentFixture<EditUserProfileComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UserService', ['getProfileDetails', 'UpdateUserProfile']);
    
    await TestBed.configureTestingModule({
      declarations: [ 
        EditUserProfileComponent,
        HeaderComponent,
        FooterComponent 
      ],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: UserService, useValue: spy }
      ]
    })
    .compileComponents();

    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  beforeEach(() => {
    // Mock sessionStorage
    spyOn(sessionStorage, 'getItem').and.returnValue('test@example.com');
    
    // Mock the getProfileDetails method
    userServiceSpy.getProfileDetails.and.returnValue(of([{
      id: 1,
      username: 'Test User',
      email: 'test@example.com',
      gender: 'Male',
      age: 30,
      mobile: '1234567890',
      password: 'password123',
      address: '123 Test St'
    }]));

    fixture = TestBed.createComponent(EditUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user profile on init', () => {
    expect(userServiceSpy.getProfileDetails).toHaveBeenCalled();
    expect(component.user).toBeDefined();
    expect(component.user.username).toBe('Test User');
  });

  it('should toggle edit mode', () => {
    expect(component.isEditing).toBeFalse();
    component.toggleEditMode();
    expect(component.isEditing).toBeTrue();
    component.toggleEditMode();
    expect(component.isEditing).toBeFalse();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
  });

  it('should update user profile', () => {
    userServiceSpy.UpdateUserProfile.and.returnValue(of({ message: 'Profile updated successfully' }));
    
    component.updateUserProfile();
    
    expect(userServiceSpy.UpdateUserProfile).toHaveBeenCalledWith(component.user);
    expect(component.successMessage).toBe('Profile updated successfully!');
    expect(component.isEditing).toBeFalse();
  });

  it('should cancel edit mode and reload profile', () => {
    // First enable edit mode
    component.isEditing = true;
    
    // Spy on loadUserProfile method
    spyOn(component, 'loadUserProfile');
    
    // Call cancelEdit
    component.cancelEdit();
    
    // Verify edit mode is disabled and profile is reloaded
    expect(component.isEditing).toBeFalse();
    expect(component.loadUserProfile).toHaveBeenCalled();
  });
});