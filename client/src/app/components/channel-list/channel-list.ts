import { Component, OnInit } from '@angular/core';
import { ChannelService } from '../../services/channel';
import { Channel } from '../../models/channel.model';
import { AuthService } from '../../services/auth';
import { GroupService } from '../../services/group';

@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.component.html',
  styleUrls: ['./channel-list.component.css']
})
export class ChannelListComponent implements OnInit {
  channels: Channel[] = [];
  newChannelName: string = '';
  selectedGroupId: string = '';

  constructor(
    private channelService: ChannelService,
    private authService: AuthService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.loadChannels();
  }

  loadChannels() {
    const user = this.authService.getUser();
    if (user.groups.length > 0) {
      this.channelService.getGroupChannels(user.groups[0]).subscribe(
        (channels) => {
          this.channels = channels;
          this.channelService.saveChannels(channels);
        }
      );
    }
  }

  createChannel() {
    if (this.newChannelName && this.authService.hasRole('group_admin')) {
      const userId = this.authService.getUser().id;
      const groupId = this.selectedGroupId || this.authService.getUser().groups[0];
      this.channelService.createChannel(this.newChannelName, groupId, userId).subscribe(
        (channel) => {
          this.newChannelName = '';
          this.loadChannels();
        },
        (error) => console.error('Error creating channel:', error)
      );
    }
  }

  joinChannel(channelId: string) {
    const userId = this.authService.getUser().id;
    this.channelService.joinChannel(channelId, userId).subscribe(
      (channel) => {
        this.loadChannels();
      },
      (error) => console.error('Error joining channel:', error)
    );
  }

  leaveChannel(channelId: string) {
    const userId = this.authService.getUser().id;
    this.channelService.leaveChannel(channelId, userId).subscribe(
      () => {
        this.loadChannels();
      },
      (error) => console.error('Error leaving channel:', error)
    );
  }
}