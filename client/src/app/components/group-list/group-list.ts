import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group';
import { Group } from '../../models/group.model';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  groups: Group[] = [];
  newGroupName: string = '';

  constructor(
    private groupService: GroupService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    const userId = this.authService.getUser().id;
    this.groupService.getUserGroups(userId).subscribe({
      next: (groups) => {
        this.groups = groups;
        this.groupService.saveGroups(groups);
      },
      error: (error) => console.error('Error loading groups:', error)
    });
  }

  createGroup() {
    if (this.newGroupName && this.authService.hasRole('group_admin')) {
      const userId = this.authService.getUser().id;
      this.groupService.createGroup(this.newGroupName, userId).subscribe({
        next: (group) => {
          this.newGroupName = '';
          this.loadGroups();
        },
        error: (error) => console.error('Error creating group:', error)
      });
    }
  }

  joinGroup(groupId: string) {
    const userId = this.authService.getUser().id;
    this.groupService.joinGroup(groupId, userId).subscribe({
      next: (group) => {
        this.loadGroups();
      },
      error: (error) => console.error('Error joining group:', error)
    });
  }

  leaveGroup(groupId: string) {
    const userId = this.authService.getUser().id;
    this.groupService.leaveGroup(groupId, userId).subscribe({
      next: () => {
        this.loadGroups();
      },
      error: (error) => console.error('Error leaving group:', error)
    });
  }
}
