import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  joinChannel(channelId: string, userId: string, username: string) {
    this.socket.emit('joinChannel', { channelId, userId, username });
  }

  leaveChannel(channelId: string, username: string) {
    this.socket.emit('leaveChannel', { channelId, username });
  }

  sendMessage(channelId: string, userId: string, username: string, message: string) {
    this.socket.emit('chatMessage', { channelId, userId, username, message });
  }

  onHistory(): Observable<any[]> {
    return new Observable(observer => {
      this.socket.on('chatHistory', (history) => observer.next(history));
    });
  }

  onMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('chatMessage', (msg) => observer.next(msg));
    });
  }

  onUserJoined(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('userJoined', (data) => observer.next(data));
    });
  }

  onUserLeft(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('userLeft', (data) => observer.next(data));
    });
  }

  onSystem(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('system', (data) => observer.next(data));
    });
  }
}
