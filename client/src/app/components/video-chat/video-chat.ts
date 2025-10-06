import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Peer from 'peerjs';

@Component({
  selector: 'app-video-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h2>Video Chat</h2>

    <div class="video-container">
      <video #myVideo autoplay muted playsinline></video>
      <video #remoteVideo autoplay playsinline></video>
    </div>

    <div class="control-panel">
      <p *ngIf="!myPeerId">Connecting to PeerJS server...</p>
      <p *ngIf="myPeerId"><strong>Your Peer ID:</strong> {{ myPeerId }}</p>

      <input [(ngModel)]="remotePeerId" placeholder="Enter Remote Peer ID" />
      <button (click)="call()">Call</button>

      <p class="status" [ngClass]="statusClass">{{ statusMessage }}</p>
    </div>
  `,
  styles: [`
    .video-container {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-bottom: 10px;
    }
    video {
      width: 45%;
      background: #000;
      border-radius: 8px;
    }
    .control-panel {
      text-align: center;
      margin-top: 10px;
    }
    input {
      padding: 6px;
      margin-right: 5px;
    }
    .status {
      margin-top: 10px;
      font-weight: 500;
    }
    .status.ok { color: green; }
    .status.error { color: red; }
  `]
})
export class VideoChatComponent implements OnInit, OnDestroy {
  @ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  peer!: Peer;
  myPeerId = '';
  remotePeerId = '';
  localStream!: MediaStream;
  callRef: any;

  statusMessage = 'Connecting...';
  statusClass = '';

  async ngOnInit() {
    this.peer = new Peer({
      host: 'localhost',
      port: 3001,
      path: '/peerjs',
      debug: 3
    });

    this.peer.on('open', id => {
      this.myPeerId = id;
      this.statusMessage = 'Connected to PeerJS server';
      this.statusClass = 'ok';
      console.log('My Peer ID:', id);
    });

    this.peer.on('error', err => {
      console.error('PeerJS Error:', err);
      this.statusMessage = 'PeerJS connection failed (' + err.type + ')';
      this.statusClass = 'error';
    });

    this.peer.on('call', async call => {
      console.log('Incoming call from:', call.peer);
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      call.answer(this.localStream);

      this.myVideo.nativeElement.srcObject = this.localStream;
      call.on('stream', remoteStream => {
        this.remoteVideo.nativeElement.srcObject = remoteStream;
      });

      this.callRef = call;
      this.statusMessage = 'In Call with ' + call.peer;
    });
  }

  async call() {
    if (!this.remotePeerId.trim()) return alert('Please enter a Peer ID first.');
    this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    this.myVideo.nativeElement.srcObject = this.localStream;

    const call = this.peer.call(this.remotePeerId, this.localStream);
    this.callRef = call;

    call.on('stream', remoteStream => {
      this.remoteVideo.nativeElement.srcObject = remoteStream;
    });

    call.on('close', () => {
      this.statusMessage = 'Call ended';
    });

    this.statusMessage = 'Calling ' + this.remotePeerId + '...';
  }

  ngOnDestroy() {
    if (this.callRef) this.callRef.close();
    if (this.localStream) this.localStream.getTracks().forEach(t => t.stop());
    if (this.peer) this.peer.destroy();
  }
}
