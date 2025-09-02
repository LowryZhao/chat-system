import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/users';
  private userKey = 'user';
  private user: any = null;

  constructor(private http: HttpClient) {
    this.loadUser();
  }

  private loadUser() {
    const raw = localStorage.getItem(this.userKey);
    this.user = raw ? JSON.parse(raw) : null;
  }

  private saveUser(user: any) {
    this.user = user;
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

login(username: string, password: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/login`, { username, password })
    .pipe(tap(u => this.saveUser(u)));
}

register(username: string, email: string, password: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/register`, { username, email, password });
}


  logout() {
  this.user = null;
  localStorage.removeItem('user');
  } 


  getUser() {
    return this.user || {};
  }

  isAuthenticated(): boolean {
    return !!this.user?.username;
  }

  hasRole(role: string): boolean {
    return !!this.user?.roles?.includes(role);
  }
}
