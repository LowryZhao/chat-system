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

  public saveUser(user: any) {
    if (!user) return;
    this.user = user;
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap((u) => {
          if (u) this.saveUser(u);
        })
      );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, {
      username,
      email,
      password,
    });
  }

  logout() {
    this.user = null;
    localStorage.removeItem(this.userKey);
  }

  getUser() {
    if (!this.user) this.loadUser();
    return this.user || {};
  }

  isAuthenticated(): boolean {
    return !!this.getUser()?.username;
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return !!user?.roles?.includes(role);
  }

  isSuperAdmin(): boolean {
    return this.hasRole('super_admin');
  }

  isGroupAdmin(): boolean {
    return this.hasRole('group_admin');
  }

  isUser(): boolean {
    return this.hasRole('user');
  }
}
