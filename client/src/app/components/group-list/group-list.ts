import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group';
import { Group } from '../../models/group.model';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.css']
})
export class GroupListComponent implements OnInit {
  groups: Group[] = [];

  constructor(private groupService: GroupService) {}

  ngOnInit() {
    this.groups = this.groupService.getGroups(); // 初始加载本地数据
  }

  joinGroup(groupId: string) {
    this.groupService.joinGroup(groupId, 'userId').subscribe(
      (group) => console.log('Joined group:', group)
    );
  }
}