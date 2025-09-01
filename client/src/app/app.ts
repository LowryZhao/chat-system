import { Component } from '@angular/core';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }
}