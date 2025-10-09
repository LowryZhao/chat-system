import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [CommonModule]
})
export class ProfileComponent {
  user: any;
  file: File | null = null;
  uploading = false;

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.user = this.auth.getUser();
  }

  get avatarUrl(): string {
    if (this.user?.avatar) {
      return this.user.avatar;
    }
    return '/uploads/default-avatar.png';
  }

  pick(event: any) {
    const files = event.target.files;
    this.file = files && files.length > 0 ? files[0] : null;
  }

  upload() {
    if (!this.file) return;

    this.uploading = true;
    const formData = new FormData();
    formData.append('file', this.file);

    this.http.post<any>('http://localhost:3000/upload', formData).subscribe({
      next: (res) => {
        if (this.user) {
          this.user.avatar = res.path;
        }
        this.uploading = false;
      },
      error: (err) => {
        console.error('Upload failed', err);
        this.uploading = false;
      }
    });
  }
}
