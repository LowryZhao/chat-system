import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username = '';
  password = '';
  email = '';
  isRegister = false;
  error: string | null = null;
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.isRegister ? this.register() : this.login();
  }

  login() {
    this.error = null;
    this.loading = true;

    console.log(`Attempting login: ${this.username}`);

    this.authService.login(this.username, this.password).subscribe({
      next: (user) => {
        console.log('Login successful:', user);

        if (user) {
          this.authService.saveUser(user);

          setTimeout(() => {
            this.router.navigate(['/groups']);
          }, 300);
        } else {
          this.error = 'Invalid credentials, please try again.';
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Login failed:', err);
        this.error = 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }

  register() {
    this.error = null;
    this.loading = true;

    this.authService.register(this.username, this.email, this.password).subscribe({
      next: () => {
        this.isRegister = false;
        this.password = '';
        this.error = 'Registration successful. Please login.';
        this.loading = false;
      },
      error: () => {
        this.error = 'Registration failed. Please try again.';
        this.loading = false;
      }
    });
  }

  toggleMode() {
    this.isRegister = !this.isRegister;
    this.error = null;
  }
}
