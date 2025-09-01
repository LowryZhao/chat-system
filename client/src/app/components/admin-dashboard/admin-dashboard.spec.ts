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
    if (this.authService.hasRole('super_admin')) {
      console.log('Promote user logic here');
    }
  }

  createGroup() {
    if (this.authService.hasRole('group_admin') || this.authService.hasRole('super_admin')) {
      this.groupService.createGroup('New Group', this.user.id).subscribe(
        (group) => console.log('Created group:', group)
      );
    }
  }
}