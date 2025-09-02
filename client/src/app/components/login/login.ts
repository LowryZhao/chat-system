import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  isRegister: boolean = false;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.isRegister) {
      this.register();
    } else {
      this.login();
    }
  }

  login() {
    this.error = null;
    console.log(`Submitting login: username=${this.username}, password=${this.password}`);
    this.authService.login(this.username, this.password).subscribe(
      (user) => {
        console.log('Login response:', user);
        if (user) this.router.navigate(['/groups']);
      },
      (err) => {
        console.error('Login error:', err.message);
        this.error = 'Login failed. Please try again.';
      }
    );
  }

  register() {
    this.error = null;
    this.authService.register(this.username, this.email, this.password).subscribe(
      () => this.router.navigate(['/groups']),
      (err) => this.error = 'Registration failed. Please try again.'
    );
  }

  toggleMode() {
    this.isRegister = !this.isRegister;
    this.error = null;
  }
}