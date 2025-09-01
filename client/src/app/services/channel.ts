import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Channel } from '../../models/channel.model';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private apiUrl = '/api'; 

  constructor(private http: HttpClient) {}

  createChannel(name: string, groupId: string, adminId: string): Observable<Channel> {
    return this.http.post<Channel>(`${this.apiUrl}/channels/create`, { name, groupId, adminId });
  }

  joinChannel(channelId: string, userId: string): Observable<Channel> {
    return this.http.post<Channel>(`${this.apiUrl}/channels/join`, { channelId, userId });
  }

  leaveChannel(channelId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/channels/leave`, { channelId, userId });
  }

  getGroupChannels(groupId: string): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/channels/group/${groupId}`);
  }

  saveChannels(channels: Channel[]) {
    localStorage.setItem('channels', JSON.stringify(channels));
  }
  
  getChannels(): Channel[] {
    return JSON.parse(localStorage.getItem('channels') || '[]');
  }
}