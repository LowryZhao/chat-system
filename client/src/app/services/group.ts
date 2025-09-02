import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

interface Group {
  id: string;
  name: string;
  members: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = '/api/groups';
  private groupsKey = 'groupsData';

  constructor(private http: HttpClient) {
    this.loadGroups();
  }

  private loadGroups() {
    const savedGroups = localStorage.getItem(this.groupsKey);
    let groups: Group[] = [];
    try {
      if (savedGroups) {
        groups = JSON.parse(savedGroups);
        console.log('Loaded groups data:', groups);
      } else {
        console.log('Initializing groups data');
        groups = [
          { id: '1', name: 'Group 1', members: ['1', 'user1'] },
          { id: '2', name: 'Group 2', members: ['1', 'user1', 'user2'] }
        ];
      }
      if (!Array.isArray(groups) || !groups.every(g => g.id && g.name && Array.isArray(g.members))) {
        console.error('Invalid groups data, resetting:', groups);
        groups = [
          { id: '1', name: 'Group 1', members: ['1', 'user1'] },
          { id: '2', name: 'Group 2', members: ['1', 'user1', 'user2'] }
        ];
      }
    } catch (e) {
      console.error(
        'Error parsing groups data:',
        e instanceof Error ? e.message : String(e),
        'Resetting to default'
      );
      groups = [
        { id: '1', name: 'Group 1', members: ['1', 'user1'] },
        { id: '2', name: 'Group 2', members: ['1', 'user1', 'user2'] }
      ];
    }
    this.saveGroups(groups);
  }

  private saveGroups(groups: Group[]) {
    localStorage.setItem(this.groupsKey, JSON.stringify(groups));
    console.log('Saved groups data:', groups);
  }

  getUserGroups(userId: string): Observable<Group[]> {
    console.log('Fetching groups for userId:', userId, ' (type:', typeof userId, ')');
    const groups: Group[] = JSON.parse(localStorage.getItem(this.groupsKey) || '[]');
    console.log('Local groups:', groups);
    const filteredGroups = groups.filter((g: Group) => g.members.includes(userId));
    console.log('Filtered groups:', filteredGroups);
    return of(filteredGroups);
  }

  createGroup(name: string, userId: string): Observable<Group> {
    const groups: Group[] = JSON.parse(localStorage.getItem(this.groupsKey) || '[]');
    const newGroup: Group = { id: Date.now().toString(), name, members: [userId] };
    groups.push(newGroup);
    this.saveGroups(groups);
    return of(newGroup);
  }

  joinGroup(groupId: string, userId: string): Observable<any> {
    console.log(`Joining group ${groupId} with user ${userId}`);
    return this.http.post(`${this.apiUrl}/${groupId}/join`, { userId });
  }

  leaveGroup(groupId: string, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${groupId}/leave`, { userId });
  }
}
