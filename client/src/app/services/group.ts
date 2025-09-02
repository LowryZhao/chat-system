import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group } from '../models/group.model';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  createGroup(name: string, adminId: string): Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}/groups/create`, { name, adminId });
  }

  joinGroup(groupId: string, userId: string): Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}/groups/join`, { groupId, userId });
  }

  leaveGroup(groupId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/groups/leave`, { groupId, userId });
  }

  getUserGroups(userId: string): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/groups/user/${userId}`);
  }

  saveGroups(groups: Group[]) {
    localStorage.setItem('groups', JSON.stringify(groups));
  }

  getGroups(): Group[] {
    return JSON.parse(localStorage.getItem('groups') || '[]');
  }
}
