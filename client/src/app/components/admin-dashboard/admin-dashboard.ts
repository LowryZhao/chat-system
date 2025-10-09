import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { GroupService } from '../../services/group';
import { ChannelService } from '../../services/channel';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminDashboardComponent implements OnInit {

  newUserUsername = '';
  newUserEmail = '';
  newUserPassword = '';
  newUserRole = 'user';
  removeUserId = '';

  groupName = '';
  targetGroupId = '';
  targetGroupUserId = ''; 
  deleteGroupId = '';

  channelName = '';
  channelGroupId = '';
  targetChannelId = '';
  targetChannelUserId = ''; 
  deleteChannelId = '';

  constructor(
    public authService: AuthService,
    private groupService: GroupService,
    private channelService: ChannelService,
    private userService: UserService
  ) {}

  ngOnInit() {}

  createUser() {
    const adminId = this.authService.getUser()?.id;
    if (!this.newUserUsername || !this.newUserEmail || !this.newUserPassword) {
      alert('Please fill all required fields.');
      return;
    }

    this.userService
      .createUserByAdmin(adminId, this.newUserUsername, this.newUserEmail, this.newUserPassword, this.newUserRole)
      .subscribe({
        next: () => alert('User created successfully'),
        error: (err) => alert(err.error?.error || 'Failed to create user')
      });
  }

  removeUser() {
    const adminId = this.authService.getUser()?.id;
    this.userService.removeUser(adminId, this.removeUserId).subscribe({
      next: () => alert('User removed successfully'),
      error: (err) => alert(err.error?.error || 'Failed to remove user')
    });
  }

  createGroup() {
    const adminId = this.authService.getUser()?.id;
    this.groupService.createGroup(this.groupName, adminId).subscribe({
      next: () => alert('Group created successfully'),
      error: (err) => alert(err.error?.error || 'Failed to create group')
    });
  }

  addUserToGroup() {
    const adminId = this.authService.getUser()?.id;
    this.groupService.addUserToGroup(this.targetGroupId, adminId, this.targetGroupUserId).subscribe({
      next: () => alert('User added to group'),
      error: (err) => alert(err.error?.error || 'Failed to add user to group')
    });
  }

  removeUserFromGroup() {
    const adminId = this.authService.getUser()?.id;
    this.groupService.removeUserFromGroup(this.targetGroupId, adminId, this.targetGroupUserId).subscribe({
      next: () => alert('User removed from group'),
      error: (err) => alert(err.error?.error || 'Failed to remove user from group')
    });
  }

  deleteGroup() {
    const adminId = this.authService.getUser()?.id;
    this.groupService.deleteGroup(this.deleteGroupId, adminId).subscribe({
      next: () => alert('Group deleted successfully'),
      error: (err) => alert(err.error?.error || 'Failed to delete group')
    });
  }

  createChannel() {
    const adminId = this.authService.getUser()?.id;
    this.channelService.createChannel(this.channelName, this.channelGroupId, adminId).subscribe({
      next: () => alert('Channel created successfully'),
      error: (err) => alert(err.error?.error || 'Failed to create channel')
    });
  }

  addUserToChannel() {
    const adminId = this.authService.getUser()?.id;
    this.channelService.addUserToChannel(this.targetChannelId, adminId, this.targetChannelUserId).subscribe({
      next: () => alert('User added to channel'),
      error: (err) => alert(err.error?.error || 'Failed to add user to channel')
    });
  }

  removeUserFromChannel() {
    const adminId = this.authService.getUser()?.id;
    this.channelService.removeUserFromChannel(this.targetChannelId, adminId, this.targetChannelUserId).subscribe({
      next: () => alert('User removed from channel'),
      error: (err) => alert(err.error?.error || 'Failed to remove user from channel')
    });
  }

  deleteChannel() {
    const adminId = this.authService.getUser()?.id;
    this.channelService.deleteChannel(this.deleteChannelId, adminId).subscribe({
      next: () => alert('Channel deleted successfully'),
      error: (err) => alert(err.error?.error || 'Failed to delete channel')
    });
  }
}
