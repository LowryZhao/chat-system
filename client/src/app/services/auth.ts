import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userKey = 'user';
  private user: any;

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  private loadUser() {
    const savedUser = localStorage.getItem(this.userKey);
    this.user = savedUser ? JSON.parse(savedUser) : null;
    console.log('Loaded user:', this.user);
  }

  private saveUser(user: any) {
    this.user = user;
    localStorage.setItem(this.userKey, JSON.stringify(user));
    console.log('Saved user:', user);
  }

  login(username: string, password: string): Observable<any> {
    console.log(`Login attempt: username=${username}, password=${password}`);
    const savedUser = this.user || JSON.parse(localStorage.getItem(this.userKey) || '{}');
    console.log('Saved user data:', savedUser);
    if (savedUser.username === username && savedUser.password === password) {
      this.saveUser(savedUser);
      console.log('Login successful, user:', savedUser);
      return of(savedUser);
    }
    console.log('Login failed, no match found');
    return of(null).pipe(
      tap(() => { throw new Error('Invalid credentials'); })
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    const user = { id: Date.now().toString(), username, email, password, roles: ['user'], groups: [] };
    this.saveUser(user);
    return of(user);
  }

  getUser() {
    return this.user || { id: '1', username: 'super', password: '123', email: 'super@admin.com', roles: ['super_admin'], groups: [] };
  }

  isAuthenticated() {
    return !!this.user;
  }

  hasRole(role: string) {
    return this.user?.roles?.includes(role) || false;
  }
}