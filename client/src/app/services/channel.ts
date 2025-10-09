import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Channel } from '../models/channel.model';

@Injectable({ providedIn: 'root' })
export class ChannelService {
  private apiUrl = 'http://localhost:3000/api/channels';

  constructor(private http: HttpClient) {}

  //创建
  createChannel(name: string, groupId: string, adminId: string): Observable<Channel> {
    return this.http.post<Channel>(`${this.apiUrl}/create`, { name, groupId, adminId });
  }

  //添加用户
  addUserToChannel(channelId: string, adminId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${channelId}/add-user`, { adminId, userId });
  }

  //移除用户
  removeUserFromChannel(channelId: string, adminId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${channelId}/remove-user`, { adminId, userId });
  }

  //用户退出
  leaveChannel(channelId: string, userId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/leave`, { channelId, userId });
  }

  //获取频道列表
  getGroupChannels(groupId: string, userId: string): Observable<Channel[]> {
    return this.http.get<Channel[]>(`${this.apiUrl}/group/${groupId}`, {
      params: { userId }
    });
  }

  //删除频道
  deleteChannel(channelId: string, adminId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${channelId}`, {
      body: { adminId }
    });
  }

  //存入本地
  saveChannels(channels: Channel[]) {
    localStorage.setItem('channels', JSON.stringify(channels));
  }

  getChannels(): Channel[] {
    return JSON.parse(localStorage.getItem('channels') || '[]');
  }
}
