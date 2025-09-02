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

  constructor(
    public authService: AuthService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private loadData() {
    const userId = this.authService.getUser().id;

    this.groupService.getUserGroups(userId).subscribe(gs => this.myGroups = gs);
    
    this.groupService.getAllGroups().subscribe(gs => this.allGroups = gs);
  }

  join(groupId: string) {
    const userId = this.authService.getUser().id;
    this.groupService.joinGroup(groupId, userId).subscribe(() => this.loadData());
  }

  leave(groupId: string) {
    const userId = this.authService.getUser().id;
    this.groupService.leaveGroup(groupId, userId).subscribe(() => this.loadData());
  }

  isMember(group: Group): boolean {
    const uid = this.authService.getUser().id;
    return group.members?.includes(uid);
  }
}
