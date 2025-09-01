import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { GroupListComponent } from './components/group-list/group-list';
import { ChannelListComponent } from './components/channel-list/channel-list';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { UserProfileComponent } from './components/user-profile/user-profile';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'groups', component: GroupListComponent, canActivate: [AuthGuard] },
  { path: 'channels', component: ChannelListComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}