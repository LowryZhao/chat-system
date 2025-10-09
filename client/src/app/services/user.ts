import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  //用户登录
  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  //注册
  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

  //admin创建用户
  createUserByAdmin(adminId: string, username: string, email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, {
      adminId,
      username,
      email,
      password,
      role
    });
  }

  //移除用户
  removeUser(adminId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove`, { adminId, userId });
  }

  //获取用户列表
  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }
}
