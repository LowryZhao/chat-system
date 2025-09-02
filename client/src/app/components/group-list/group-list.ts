import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../services/group';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.html',
  styleUrls: ['./group-list.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class GroupListComponent implements OnInit {
  groups: any[] = [];
  newGroupName: string = '';

  constructor(public authService: AuthService, private groupService: GroupService) {}

  ngOnInit() {
    console.log('GroupListComponent initialized');
    this.loadGroups();
  }

  loadGroups() {
    const user = this.authService.getUser();
    if (!user || !user.id) {
      console.error('No user ID available:', user);
      return;
    }
    console.log('Loading groups for userId:', user.id);
    this.groupService.getUserGroups(user.id).subscribe(
      (groups) => {
        console.log('Groups loaded:', groups);
        this.groups = groups;
      },
      (error) => {
        console.error('Failed to load groups:', error);
      }
    );
  }

  createGroup() {
    if (this.newGroupName && this.authService.hasRole('group_admin')) {
      const userId = this.authService.getUser().id;
      this.groupService.createGroup(this.newGroupName, userId).subscribe(
        (group) => {
          this.newGroupName = '';
          this.loadGroups();
        },
        (error) => console.error('Error creating group:', error)
      );
    }
  }

  joinGroup(groupId: string) {
    const userId = this.authService.getUser().id;
    this.groupService.joinGroup(groupId, userId).subscribe(() => this.loadGroups());
  }

  leaveGroup(groupId: string) {
    const userId = this.authService.getUser().id;
    this.groupService.leaveGroup(groupId, userId).subscribe(() => this.loadGroups());
  }
}