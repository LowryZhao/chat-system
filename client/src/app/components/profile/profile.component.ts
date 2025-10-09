import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  file: File | null = null;
  user: any = {};
  uploading = false;

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    console.log('ProfileComponent loaded');
    const storedUser = this.auth.getUser?.();
    if (storedUser) {
      this.user = storedUser;
    } else {
      this.user = { id: 'test-user', avatar: '' };
    }
  }

  pick(event: any) {
    this.file = event.target?.files?.[0] ?? null;
  }

  upload() {
    if (!this.file) {
      alert('Please select a file first.');
      return;
    }

    this.uploading = true;

    const fd = new FormData();
    fd.append('avatar', this.file);
    fd.append('userId', this.user?.id ?? '');

    this.http.post<{ path: string }>('http://localhost:3000/api/upload/avatar', fd)
      .subscribe({
        next: ({ path }) => {
          this.user.avatar = path || '';

          try {
            localStorage.setItem('user', JSON.stringify(this.user));
          } catch (e) {
            console.warn('localStorage unavailable in test mode');
          }

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

  get avatarUrl(): string {
    const avatarPath = this.user?.avatar ?? '';
    if (avatarPath && avatarPath.includes('/uploads/')) {
      return avatarPath.startsWith('http')
        ? avatarPath
        : `http://localhost:3000${avatarPath}`;
    }
    return 'http://localhost:3000/uploads/default-avatar.png';
  }
}
