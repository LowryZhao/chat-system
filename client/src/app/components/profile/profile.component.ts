import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  file: File | null = null;
  user: any;
  uploading = false;

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    console.log('ProfileComponent loaded');
    this.user = this.auth.getUser();
  }

  pick(event: any) {
    this.file = event.target.files?.[0] ?? null;
  }

  upload() {
    if (!this.file) return alert('Please select a file first.');
    this.uploading = true;

    const fd = new FormData();
    fd.append('avatar', this.file);
    fd.append('userId', this.user.id);

    this.http.post<{ path: string }>('http://localhost:3000/api/upload/avatar', fd)
      .subscribe({
        next: ({ path }) => {
          this.user.avatar = path;
          localStorage.setItem('user', JSON.stringify(this.user));

          alert('Avatar updated successfully!');
          this.uploading = false;
        },
        error: (err) => {
          console.error('Upload failed:', err);
          alert('Upload failed. Please try again.');
          this.uploading = false;
        }
      });
  }

  get avatarUrl() {
    return this.user?.avatar
      ? 'http://localhost:3000' + this.user.avatar
      : 'http://localhost:3000/uploads/default-avatar.png';
  }
}
