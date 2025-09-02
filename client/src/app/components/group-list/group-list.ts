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

  constructor(public authService: AuthService, private groupService: GroupService) {
    console.log('AuthService userId:', this.authService.getUser().id);
  }

  ngOnInit() {
    this.loadGroups();
  }

  loadGroups() {
    const userId = String(this.authService.getUser().id);
    console.log('Loading groups for userId:', userId, ' (type:', typeof userId, ')');
    this.groupService.getUserGroups(userId).subscribe(
      (groups) => {
        console.log('Received groups:', groups);
        this.groups = groups;
      },
      (error) => console.error('Error loading groups:', error)
    );
  }

  joinGroup(groupId: string) {
    const userId = this.authService.getUser().id;
    this.groupService.joinGroup(groupId, userId).subscribe(
      () => this.loadGroups(),
      (error) => console.error('Join failed:', error)
    );
  }

  leaveGroup(groupId: string) {
    const userId = this.authService.getUser().id;
    this.groupService.leaveGroup(groupId, userId).subscribe(
      () => this.loadGroups(),
      (error) => console.error('Leave failed:', error)
    );
  }
}