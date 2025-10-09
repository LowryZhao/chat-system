import { Injectable, OnDestroy } from '@angular/core';
import { io as socketIo, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

// 允许测试时注入自定义 io 工厂 
let ioFactory = socketIo;
export function setIoFactory(factory: typeof socketIo) {
  ioFactory = factory;
}

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
      this.socket = ioFactory(this.SERVER_URL, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      this.connected = true;
      console.log('Connected to Socket.IO server');
    }
  }

  //加入
  joinChannel(channelId: string, userId: string, username: string) {
    this.socket.emit('joinChannel', { channelId, userId, username });
  }

  //离开
  leaveChannel(channelId: string, username: string) {
    this.socket.emit('leaveChannel', { channelId, username });
  }

  //发送信息功能
  sendMessage(
    channelId: string,
    userId: string,
    username: string,
    message?: string | null,
    imageUrl?: string | null
  ) {
    this.socket.emit('chatMessage', {
      channelId,
      userId,
      username,
      message: message || null,
      imageUrl: imageUrl || null
    });
  }

  //获取历史聊天记录
  onHistory(): Observable<any[]> {
    return new Observable(observer => {
      this.socket.off('chatHistory');
      this.socket.on('chatHistory', (history) => observer.next(history));
    });
  }

  //监听新消息
  onMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.off('chatMessage');
      this.socket.on('chatMessage', (msg) => observer.next(msg));
    });
  }

  //用户加入提醒
  onUserJoined(): Observable<any> {
    return new Observable(observer => {
      this.socket.off('userJoined');
      this.socket.on('userJoined', (data) => observer.next(data));
    });
  }

  //用户离开提醒
  onUserLeft(): Observable<any> {
    return new Observable(observer => {
      this.socket.off('userLeft');
      this.socket.on('userLeft', (data) => observer.next(data));
    });
  }

  //系统通知
  onSystem(): Observable<any> {
    return new Observable(observer => {
      this.socket.off('system');
      this.socket.on('system', (data) => observer.next(data));
    });
  }

  //断开连接
  ngOnDestroy(): void {
    if (this.socket && this.connected) {
      this.socket.disconnect();
      this.connected = false;
      console.log('Socket disconnected');
    }
  }
}
