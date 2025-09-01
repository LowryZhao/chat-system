import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth';
import { GroupService } from '../../services/group';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService, private groupService: GroupService) {}

  ngOnInit() {
    this.user = this.authService.getUser();
  }

  leaveGroup() {
    this.groupService.leaveGroup('groupId', this.user.id).subscribe(
      () => console.log('Left group')
    );
  }

  deleteAccount() {
    console.log('Delete account logic here');
  }
}