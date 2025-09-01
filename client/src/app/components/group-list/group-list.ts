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
    this.groupService.getUserGroups(userId).subscribe(
      (groups) => {
        this.groups = groups;
        this.groupService.saveGroups(groups);
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
    this.groupService.joinGroup(groupId, userId).subscribe(
      (group) => {
        this.loadGroups();
      },
      (error) => console.error('Error joining group:', error)
    );
  }

  leaveGroup(groupId: string) {
    const userId = this.authService.getUser().id;
    this.groupService.leaveGroup(groupId, userId).subscribe(
      () => {
        this.loadGroups();
      },
      (error) => console.error('Error leaving group:', error)
    );
  }
}