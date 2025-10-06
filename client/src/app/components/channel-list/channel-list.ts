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
        this.fetchChannelsByGroup(this.selectedGroupId, userId);
      },
      error: () => {
        this.myGroups = [];
        this.channels = [];
      }
    });
  }

  private fetchChannelsByGroup(groupId: string, userId: string) {
    if (!groupId) {
      this.channels = [];
      return;
    }
    this.channelService.getGroupChannels(groupId, userId).subscribe({
      next: (chs: Channel[]) => (this.channels = chs || []),
      error: () => (this.channels = [])
    });
  }

  onGroupChange() {
    const userId = this.authService.getUser().id;
    this.fetchChannelsByGroup(this.selectedGroupId, userId);
  }

  createChannel() {
    if (!this.newChannelName) return;
    const user = this.authService.getUser();
    if (!user?.id || !this.authService.hasRole('group_admin')) return;

    this.channelService
      .createChannel(this.newChannelName, this.selectedGroupId, user.id)
      .subscribe({
        next: () => {
          this.newChannelName = '';
          this.fetchChannelsByGroup(this.selectedGroupId, user.id);
        },
        error: (err) => alert(err.error?.error || 'Failed to create channel')
      });
  }

  leaveChannel(channelId: string) {
    const userId = this.authService.getUser().id;
    this.channelService.leaveChannel(channelId, userId).subscribe({
      next: () => this.fetchChannelsByGroup(this.selectedGroupId, userId),
      error: () => alert('Failed to leave channel')
    });
  }
}
