import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Group {
  id: string;
  name: string;
  members: string[];
  admins?: string[];
  channels?: string[];
}

@Injectable({ providedIn: 'root' })
export class GroupService {
  private apiUrl = 'http://localhost:3000/api/groups';

  constructor(private http: HttpClient) {}

  createGroup(name: string, adminId: string): Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}/create`, { name, adminId });
  }

  getUserGroups(userId: string): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/user/${userId}`);
  }

  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/all`);
  }

  addUserToGroup(groupId: string, adminId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${groupId}/add-user`, { adminId, userId });
  }

  removeUserFromGroup(groupId: string, adminId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${groupId}/remove-user`, { adminId, userId });
  }

  deleteGroup(groupId: string, adminId: string): Observable<any> {
    return this.http.request('delete', `${this.apiUrl}/${groupId}`, { body: { adminId } });
  }
}
