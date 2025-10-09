import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Peer, { MediaConnection } from 'peerjs';

let PeerFactory = Peer;
export function setPeerFactory(factory: typeof Peer) {
  PeerFactory = factory;
}

@Component({
  selector: 'app-video-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './video-chat.html',
  styleUrls: ['./video-chat.css']
})
export class VideoChatComponent implements OnInit, OnDestroy {
  @ViewChild('myVideo') myVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  peer!: Peer;
  callRef!: MediaConnection;
  myPeerId = '';
  remotePeerId = '';
  localStream!: MediaStream;

  statusMessage = 'Connecting...';
  statusClass = '';

  async ngOnInit() {
    try {
      this.peer = new PeerFactory({
        host: 'localhost',
        port: 3001,
        path: '/peerjs',
        debug: 2
      });

      this.peer.on('open', (id) => {
        this.myPeerId = id;
        this.statusMessage = 'Connected to PeerJS Server';
        this.statusClass = 'ok';
        console.log('My Peer ID:', id);
      });

      this.peer.on('error', (err) => {
        console.error('PeerJS Error:', err);
        this.statusMessage = `PeerJS connection failed (${err.type})`;
        this.statusClass = 'error';
      });

      this.peer.on('call', async (call) => {
        console.log('Incoming call from:', call.peer);

        this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        call.answer(this.localStream);
        this.myVideo.nativeElement.srcObject = this.localStream;

        call.on('stream', (remoteStream) => {
          this.remoteVideo.nativeElement.srcObject = remoteStream;
        });

        this.callRef = call;
        this.statusMessage = 'In call with ' + call.peer;
        this.statusClass = 'ok';
      });
    } catch (err) {
      console.error('Init PeerJS failed:', err);
      this.statusMessage = 'Unable to connect to PeerJS';
      this.statusClass = 'error';
    }
  }

  async call() {
    if (!this.remotePeerId.trim()) {
      alert('Please enter a valid Peer ID first.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.localStream = stream;

      if (this.myVideo?.nativeElement) {
        this.myVideo.nativeElement.srcObject = stream;
      }

      this.callRef = this.peer.call(this.remotePeerId, this.localStream);

      await Promise.resolve();

      this.callRef.on('stream', (remoteStream: MediaStream) => {
        if (this.remoteVideo?.nativeElement) {
          this.remoteVideo.nativeElement.srcObject = remoteStream;
        }
        this.statusMessage = 'Connected to ' + this.remotePeerId;
        this.statusClass = 'ok';
      });

      this.statusMessage = 'Calling ' + this.remotePeerId + '...';
      this.statusClass = '';
    } catch (err) {
      console.error('Media error:', err);
      this.statusMessage = 'Unable to access camera';
      this.statusClass = 'error';
      await Promise.resolve();
    }
  }

  ngOnDestroy() {
    try {
      if (this.callRef) this.callRef.close();
      if (this.localStream) this.localStream.getTracks().forEach((t) => t.stop());
      if (this.peer) this.peer.destroy();
    } catch (err) {
      console.warn('Cleanup error:', err);
    }
  }
}
