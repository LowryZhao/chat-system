import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../services/channel';
import { AuthService } from '../../services/auth';
import { GroupService } from '../../services/group';

@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.html',
  styleUrls: ['./channel-list.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChannelListComponent implements OnInit {
  channels: any[] = [];
  newChannelName: string = '';
  selectedGroupId: string = '';

  constructor(
    public authService: AuthService,
    private channelService: ChannelService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.loadChannels();
  }

  loadChannels() {
    const user = this.authService.getUser();
    if (user.groups.length > 0) {
      this.selectedGroupId = user.groups[0];
      this.channelService.getGroupChannels(this.selectedGroupId).subscribe(
        (channels) => (this.channels = channels)
      );
    }
  }

  createChannel() {
    if (this.newChannelName && this.authService.hasRole('group_admin')) {
      const userId = this.authService.getUser().id;
      if (this.selectedGroupId) {
        this.channelService.createChannel(this.newChannelName, this.selectedGroupId, userId).subscribe(
          (channel) => {
            this.newChannelName = '';
            this.loadChannels();
          }
        );
      }
    }
  }

  joinChannel(channelId: string) {
    const userId = this.authService.getUser().id;
    this.channelService.joinChannel(channelId, userId).subscribe(() => this.loadChannels());
  }

  leaveChannel(channelId: string) {
    const userId = this.authService.getUser().id;
    this.channelService.leaveChannel(channelId, userId).subscribe(() => this.loadChannels());
  }
}