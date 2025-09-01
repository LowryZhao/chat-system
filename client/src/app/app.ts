import { Component } from '@angular/core';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  isAuthenticated(): boolean {
    return !!this.authService.getUser().username;
  }

  isAdmin(): boolean {
    const user = this.authService.getUser();
    return user.roles && (user.roles.includes('super_admin') || user.roles.includes('group_admin'));
  }
}