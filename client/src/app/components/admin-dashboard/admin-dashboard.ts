import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { GroupService } from '../../services/group';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AdminDashboardComponent implements OnInit {
  constructor(public authService: AuthService, private groupService: GroupService) {}

  ngOnInit() {}

  promoteUser() {
    console.log('Promote User');
  }

  createGroup() {
    console.log('Create Group');
  }
}