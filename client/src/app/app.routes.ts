import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { GroupListComponent } from './components/group-list/group-list';
import { ChannelListComponent } from './components/channel-list/channel-list';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { AuthGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'groups', component: GroupListComponent, canActivate: [AuthGuard] },
  { path: 'channels', component: ChannelListComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'video', loadComponent: () => import('./components/video-chat/video-chat').then(m => m.VideoChatComponent) },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent },
];
