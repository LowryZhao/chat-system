import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  me!: { id: string; username: string };

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(private chat: ChatService, private auth: AuthService) {}

  ngOnInit() {
    this.me = this.auth.getUser();

    this.chat.joinChannel(this.channelId, this.me.id, this.me.username);

    this.chat.onHistory().subscribe(h => {
      this.messages = h || [];
      this.scrollToBottom();
    });

    this.chat.onMessage().subscribe(m => {
      this.messages.push(m);
      this.scrollToBottom();
    });

    this.chat.onUserJoined().subscribe(({ username }) => {
      this.messages.push({ system: true, message: `👋 ${username} joined the channel.` });
      this.scrollToBottom();
    });
    this.chat.onUserLeft().subscribe(({ username }) => {
      this.messages.push({ system: true, message: `🚪 ${username} left the channel.` });
      this.scrollToBottom();
    });

    this.chat.onSystem().subscribe(({ message }) => {
      this.messages.push({ system: true, message });
      this.scrollToBottom();
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.chat.leaveChannel(this.channelId, this.me.username);
  }

  send() {
    if (!this.text.trim()) return;
    this.chat.sendMessage(this.channelId, this.me.id, this.me.username, this.text.trim());
    this.text = '';
  }

  private scrollToBottom() {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch {}
  }
}
