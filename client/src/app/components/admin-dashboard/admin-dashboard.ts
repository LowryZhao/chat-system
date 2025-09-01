import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { GroupService } from '../../services/group';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService, private groupService: GroupService) {}

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  promoteUser() {
    console.log('Promote user logic here');
  }

  createGroup() {
    this.groupService.createGroup('New Group', this.user.id).subscribe(
      (group) => console.log('Created group:', group)
    );
  }
}