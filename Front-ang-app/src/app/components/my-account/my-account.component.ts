import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css'],
})
export class MyAccountComponent implements OnInit {
  userInfo: any = { name: '', email: '', role: '', password: '' }; // User information
  editForm!: FormGroup; // Form for editing
  isEditing: boolean = false; // Edit mode flag
  isSaving: boolean = false; // Saving state flag

  constructor(private authService: AuthService, private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.userInfo = user; // Load user info
        this.initEditForm(user); // Initialize the form
      } else {
        alert('No user found. Please log in again.');
      }
    });
  }

  // Initialize the edit form
  private initEditForm(user: any): void {
    this.editForm = this.fb.group(
      {
        name: [user.name || '', Validators.required],
        email: [{ value: user.email || '', disabled: true }],
        role: [user.role || '', Validators.required],
        oldPassword: ['', Validators.required],
        newPassword: ['', Validators.minLength(8)],
        confirmPassword: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }


  // Custom validator to check if passwords match
  private passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword && confirmPassword && newPassword !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }

  // Form submission handler
  onSubmitEdit(): void {
    if (this.editForm.invalid) {
      alert('Please correct the errors in the form.');
      return;
    }

    const updatedData = {
      name: this.editForm.get('name')?.value,
      oldPassword: this.editForm.get('oldPassword')?.value,
      newPassword: this.editForm.get('newPassword')?.value,
      roleString: this.editForm.get('role')?.value,
    };

    // Ensure `newPassword` is not null
    if (!updatedData.newPassword) {
      alert('New password cannot be empty.');
      return;
    }

    this.updateUser(this.userInfo.id, updatedData);
  }


  // Update user information
  updateUser(
    userId: string,
    data: { name?: string; oldPassword?: string; newPassword?: string; roleString?: string }
  ): void {
    const headers = {
      Authorization: `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json',
    };

    const body: any = {
      name: data.name,
      oldPassword: data.oldPassword,
      roleString: data.roleString,
    };

    // Include the new password if provided
    if (data.newPassword) {
      body.newPassword = data.newPassword;
    }

    this.isSaving = true;
    this.http.put(`/api/users/${userId}`, body, { headers }).subscribe({
      next: (response) => {
        console.log('User updated successfully:', response);
        alert('Profile updated successfully!');
        this.isSaving = false;
        this.toggleEdit(); // Exit edit mode
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.isSaving = false;
        if (error.status === 400) {
          alert('Old password is incorrect or other validation failed.');
        } else {
          alert('Failed to update user. Please try again later.');
        }
      },
    });
  }

  // Toggle edit mode
  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  // Logout user
  onLogout(): void {
    this.authService.logout();
    alert('You have been logged out.');
    window.location.href = '/login'; // Redirect to login page
  }
}
