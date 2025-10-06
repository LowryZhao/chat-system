import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Channel } from '../models/channel.model';

@Injectable({ providedIn: 'root' })
export class ChannelService {
  private apiUrl = 'http://localhost:3000/api/channels';

  constructor(private http: HttpClient) {}

  createChannel(name: string, groupId: string, adminId: string): Observable<Channel> {
    return this.http.post<Channel>(`${this.apiUrl}/create`, { name, groupId, adminId });
  }

  addUserToChannel(channelId: string, adminId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${channelId}/add-user`, { adminId, userId });
  }

  removeUserFromChannel(channelId: string, adminId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${channelId}/remove-user`, { adminId, userId });
  }

  leaveChannel(channelId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/leave`, { channelId, userId });
  }

  getGroupChannels(groupId: string, userId: string): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/group/${groupId}`, {
      params: { userId }
    });
  }

  saveChannels(channels: Channel[]) {
    localStorage.setItem('channels', JSON.stringify(channels));
  }

  getChannels(): Channel[] {
    return JSON.parse(localStorage.getItem('channels') || '[]');
  }
}
