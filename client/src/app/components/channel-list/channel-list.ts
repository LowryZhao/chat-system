import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../services/channel';
import { AuthService } from '../../services/auth';
import { GroupService } from '../../services/group';
import { Channel } from '../../models/channel.model';

@Component({
  selector: 'app-channel-list',
  templateUrl: './channel-list.html',
  styleUrls: ['./channel-list.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChannelListComponent implements OnInit {
  channels: Channel[] = [];
  newChannelName = '';
  selectedGroupId = '';
  myGroups: { id: string; name: string; members?: string[] }[] = [];

  constructor(
    public authService: AuthService,
    private channelService: ChannelService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.loadChannels();
  }

  private fetchChannelsByGroup(groupId: string) {
    if (!groupId) {
      this.channels = [];
      return;
    }
    this.channelService.getGroupChannels(groupId).subscribe({
      next: (chs: Channel[]) => (this.channels = chs || []),
      error: () => (this.channels = [])
    });
  }

  loadChannels() {
    const userId = this.authService.getUser()?.id;
    if (!userId) {
      this.channels = [];
      return;
    }

    this.groupService.getUserGroups(userId).subscribe({
      next: (groups) => {
        this.myGroups = groups || [];
        if (!this.selectedGroupId && this.myGroups.length > 0) {
          this.selectedGroupId = this.myGroups[0].id;
        }
        this.fetchChannelsByGroup(this.selectedGroupId);
      },
      error: () => {
        this.myGroups = [];
        this.channels = [];
      }
    });
  }

  onGroupChange() {
    this.fetchChannelsByGroup(this.selectedGroupId);
  }

  createChannel() {
    if (!this.newChannelName || !this.authService.hasRole('group_admin')) return;
    const userId = this.authService.getUser().id;
    if (!this.selectedGroupId) return;

    this.channelService
      .createChannel(this.newChannelName, this.selectedGroupId, userId)
      .subscribe(() => {
        this.newChannelName = '';
        this.fetchChannelsByGroup(this.selectedGroupId);
      });
  }

  joinChannel(channelId: string) {
    const userId = this.authService.getUser().id;
    this.channelService.joinChannel(channelId, userId).subscribe(() => this.fetchChannelsByGroup(this.selectedGroupId));
  }

  leaveChannel(channelId: string) {
    const userId = this.authService.getUser().id;
    this.channelService.leaveChannel(channelId, userId).subscribe(() => this.fetchChannelsByGroup(this.selectedGroupId));
  }
}
