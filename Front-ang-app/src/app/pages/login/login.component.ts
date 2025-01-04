import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  signUpForm!: FormGroup;
  isSignUp = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  /**
   * Initialize login and sign-up forms.
   */
  private initForms(): void {
    // Login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    // Sign-up form
    this.signUpForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
        role: ['', Validators.required], // User role
      },
      { validators: this.passwordMatchValidator }
    );
  }

  /**
   * Custom validator to check if passwords match.
   * @param formGroup Form group
   * @returns null if passwords match, otherwise an error object
   */
  private passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  /**
   * Toggle to the sign-up view.
   */
  toggleSignUp(): void {
    this.isSignUp = true;
  }

  /**
   * Toggle to the sign-in view.
   */
  toggleSignIn(): void {
    this.isSignUp = false;
  }

  /**
   * Submit the login form.
   */
  /**
   * Submit the login form.
   */
  onSubmitLogin(): void {
    console.log('Login button clicked');
    console.log('Form Values:', this.loginForm.value);

    if (this.loginForm.invalid) {
      alert('Please fill all fields correctly!');
      return;
    }

    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    console.log('Sending login data to backend:', loginData);

    // Call AuthService to login
    this.authService.loginToBackend(loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        alert('Login successful!');

        // Store access token if available
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          console.log('Access token stored in local storage.');
        }

        // Update user state in AuthService
        const user = response.user;
        if (user) {

          console.log('User state updated in AuthService:');
        }

        // Navigate to Home page
        this.router.navigate(['/home']); // Replace '/home' with your actual route
      },
      error: (err) => {
        console.error('Login failed:', err);
        const errorMessage = err.error || 'Invalid email or password!';
        alert(`Login failed: ${errorMessage}`);
      },
    });
  }




  /**
   * Submit the sign-up form.
   */
  onSubmitSignUp(): void {
    if (this.signUpForm.invalid) {
      alert('Please fill all fields correctly!');
      return;
    }

    const { name, email, password, role } = this.signUpForm.value;
    const signUpData = { name, email, password, role };

    this.authService.signup(signUpData).subscribe({
      next: (response) => {
        console.log('Sign-up successful:', response);
        alert('Account successfully created!');
        this.toggleSignIn(); // Switch back to the sign-in view
      },
      error: (err) => {
        console.error('Sign-up failed:', err);
        const errorMessage =
          err.error?.message || 'An error occurred while signing up.';
        alert(`Sign-up failed: ${errorMessage}`);
      },
    });
  }




}
