import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: `
    <h3>Upload Avatar</h3>
    <input type="file" (change)="pick($event)" />
    <button (click)="upload()">Upload</button>

    <div *ngIf="user?.avatar" style="margin-top:8px">
      <img [src]="'http://localhost:3000' + user.avatar" width="100" height="100" style="border-radius:50%" />
    </div>
  `
})
export class ProfileComponent implements OnInit {
  file: File | null = null;
  user: any;

  constructor(private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.user = this.auth.getUser();
  }

  pick(e: any) {
    this.file = e.target.files?.[0] ?? null;
  }

  upload() {
    if (!this.file) return alert('Choose a file');
    const fd = new FormData();
    fd.append('avatar', this.file);

    this.http.post<{ path: string }>('http://localhost:3000/api/upload/avatar', fd)
      .subscribe({
        next: ({ path }) => {
          this.http.post('http://localhost:3000/api/users/update-avatar', {
            userId: this.user.id,
            avatarPath: path
          }).subscribe({
            next: () => {
              this.user.avatar = path;
              localStorage.setItem('user', JSON.stringify(this.user));
              alert('Avatar updated');
            },
            error: () => alert('Failed to update avatar')
          });
        },
        error: () => alert('Upload failed')
      });
  }
}
