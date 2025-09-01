import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  email: string = '';
  error: string = '';
  isRegister: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.isRegister) {
      this.register();
    } else {
      this.login();
    }
  }

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (user) => {
        this.authService.saveUser(user);
        this.router.navigate(['/groups']);
      },
      error: () => {
        this.error = 'Invalid credentials';
      }
    });
  }

  register() {
    this.authService.register(this.username, this.email, this.password).subscribe({
      next: (user) => {
        this.authService.saveUser(user);
        this.isRegister = false;
        this.error = 'Registration successful, please login';
      },
      error: (error) => {
        this.error = error.error?.error || 'Registration failed';
      }
    });
  }

  toggleMode() {
    this.isRegister = !this.isRegister;
    this.error = '';
  }
}
