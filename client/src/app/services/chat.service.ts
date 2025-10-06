import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService implements OnDestroy {
  private socket!: Socket;
  private readonly SERVER_URL = 'http://localhost:3000';
  private connected = false;

  constructor() {
    this.connect();
  }

  private connect() {
    if (!this.connected) {
      this.socket = io(this.SERVER_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      this.connected = true;
      console.log('Connected to Socket.IO server');
    }
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
      this.socket.off('chatHistory');
      this.socket.on('chatHistory', (history) => observer.next(history));
    });
  }

  onMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.off('chatMessage');
      this.socket.on('chatMessage', (msg) => observer.next(msg));
    });
  }

  onUserJoined(): Observable<any> {
    return new Observable(observer => {
      this.socket.off('userJoined');
      this.socket.on('userJoined', (data) => observer.next(data));
    });
  }

  onUserLeft(): Observable<any> {
    return new Observable(observer => {
      this.socket.off('userLeft');
      this.socket.on('userLeft', (data) => observer.next(data));
    });
  }

  onSystem(): Observable<any> {
    return new Observable(observer => {
      this.socket.off('system');
      this.socket.on('system', (data) => observer.next(data));
    });
  }

  ngOnDestroy(): void {
    if (this.socket && this.connected) {
      this.socket.disconnect();
      this.connected = false;
      console.log('🔌 Socket disconnected');
    }
  }
}
