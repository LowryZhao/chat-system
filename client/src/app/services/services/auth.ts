import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api'; 

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, { username, password });
  }

  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  logout() {
    localStorage.removeItem('user');
  }
}
