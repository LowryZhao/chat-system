import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() channelId = '';
  messages: any[] = [];
  text = '';
  imageFile: File | null = null;
  me!: { id: string; username: string; avatar?: string };
  private subscriptions: Subscription[] = [];

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    private chat: ChatService,
    private auth: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.me = this.auth.getUser();
    if (!this.me?.id || !this.channelId) return;

    this.chat.joinChannel(this.channelId, this.me.id, this.me.username);

    this.subscriptions.push(
      this.chat.onHistory().subscribe((h) => {
        this.messages = h || [];
        this.scrollToBottom();
      })
    );
//WebSocket消息订阅部分
    this.subscriptions.push(
      this.chat.onMessage().subscribe((m) => {
        this.messages.push(m);
        this.scrollToBottom();
      })
    );

//用户加入时的通知
    this.subscriptions.push(
      this.chat.onUserJoined().subscribe(({ username }) => {
        this.messages.push({
          system: true,
          message: `${username} joined the channel.`
        });
        this.scrollToBottom();
      })
    );

//用户离开时的通知
    this.subscriptions.push(
      this.chat.onUserLeft().subscribe(({ username }) => {
        this.messages.push({
          system: true,
          message: `${username} left the channel.`
        });
        this.scrollToBottom();
      })
    );

//系统提示的消息
    this.subscriptions.push(
      this.chat.onSystem().subscribe(({ message }) => {
        this.messages.push({ system: true, message });
        this.scrollToBottom();
      })
    );
  }

//保持聊天框在底部
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

//当用户离开时清理能看到的消息
  ngOnDestroy() {
    if (this.me?.username && this.channelId) {
      this.chat.leaveChannel(this.channelId, this.me.username);
    }
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

//信息发送功能（图片+消息）
  send() {
    if (!this.text.trim() && !this.imageFile) return;

    if (this.imageFile) {
      const fd = new FormData();
      fd.append('image', this.imageFile);

      this.http
        .post<{ path: string }>('http://localhost:3000/api/upload/image', fd)
        .subscribe({
          next: ({ path }) => {
            if (path) {
              this.chat.sendMessage(
                this.channelId,
                this.me.id,
                this.me.username,
                null,
                path
              );
              this.imageFile = null;
            } else {
              alert('Upload failed: no path returned.');
            }
          },
          error: () => alert('Image upload failed')
        });
    }
    
    if (this.text.trim()) {
      this.chat.sendMessage(
        this.channelId,
        this.me.id,
        this.me.username,
        this.text.trim()
      );
      this.text = '';
    }
  }

//选择图片  
  pickImage(event: any) {
    this.imageFile = event.target.files?.[0] ?? null;
  }

//保持在底部 
  private scrollToBottom() {
    try {
      setTimeout(() => {
        if (this.scrollContainer?.nativeElement) {
          this.scrollContainer.nativeElement.scrollTop =
            this.scrollContainer.nativeElement.scrollHeight;
        }
      }, 50);
    } catch {}
  }

//到视频聊天功能  
  goToVideoChat() {
  this.router.navigate(['/video']);

  }
}
