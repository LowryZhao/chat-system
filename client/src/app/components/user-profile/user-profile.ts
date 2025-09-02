import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.html',
  styleUrls: ['./user-profile.css'],
  standalone: true,
  imports: [CommonModule]
})
export class UserProfileComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit() {}

  get user() {
    return this.authService.getUser();
  }

  leaveGroup() {
    console.log('Leave Group');
  }

  deleteAccount() {
    console.log('Delete Account');
  }
}