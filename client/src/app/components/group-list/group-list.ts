import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService, Group } from '../../services/group';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.html',
  styleUrls: ['./group-list.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GroupListComponent implements OnInit {
  myGroups: Group[] = [];
  allGroups: Group[] = [];
  targetUserId: string = '';

  constructor(
    public authService: AuthService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.loadData();
  }
  
  private loadData() {
    const user = this.authService.getUser?.();
    const userId = user?.id;

    if (!userId) {
      console.warn('No user ID found in authService');
      this.myGroups = [];
      this.allGroups = [];
      return;
    }

    this.groupService.getUserGroups(userId).subscribe({
      next: (gs) => (this.myGroups = gs ?? []),
      error: () => (this.myGroups = [])
    });

    if (this.authService.hasRole?.('group_admin') || this.authService.hasRole?.('super_admin')) {
      this.groupService.getAllGroups().subscribe({
        next: (gs) => (this.allGroups = gs ?? []),
        error: () => (this.allGroups = [])
      });
    } else {
      this.allGroups = [];
    }
  }

  addUserToGroup(groupId: string, userId: string) {
    const adminId = this.authService.getUser?.()?.id;
    if (!adminId) return;
    if (!this.authService.hasRole?.('group_admin') && !this.authService.hasRole?.('super_admin')) return;

    this.groupService.addUserToGroup(groupId, adminId, userId).subscribe({
      next: () => {
        alert('User added to group successfully');
        this.loadData();
      },
      error: (err) => alert(err.error?.error || 'Failed to add user')
    });
  }

  removeUserFromGroup(groupId: string, userId: string) {
    const adminId = this.authService.getUser?.()?.id;
    if (!adminId) return;
    if (!this.authService.hasRole?.('group_admin') && !this.authService.hasRole?.('super_admin')) return;

    this.groupService.removeUserFromGroup(groupId, adminId, userId).subscribe({
      next: () => {
        alert('User removed from group');
        this.loadData();
      },
      error: (err) => alert(err.error?.error || 'Failed to remove user')
    });
  }

  isMember(group: Group): boolean {
    if (!group || !group.members) return false;
    const uid = this.authService.getUser?.()?.id;
    return group.members.includes(uid);
  }
}
