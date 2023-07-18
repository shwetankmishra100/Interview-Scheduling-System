import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterviewSchedulerComponent } from './interview-scheduler.component';
import { ViewInterviewsComponent } from './view-interviews/view-interviews.component';
import { ScheduleInterviewComponent } from './schedule-interview/schedule-interview.component';
import { ProfileComponent } from './profile/profile.component';
import { UsersComponent } from './users/users.component';
import { AuthGuardService } from '../services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: InterviewSchedulerComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'view-interviews'
      },
      {
        path: 'view-interviews',
        loadChildren: () => import('./view-interviews/view-interviews-routing.module').then(m => m.ViewInterviewsRoutingModule),canActivate: [AuthGuardService]
      },
      {
        path: 'schedule-interview',
        loadChildren: () => import('./schedule-interview/schedule-interview-routing.module').then(m => m.ScheduleInterviewRoutingModule),canActivate: [AuthGuardService]
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile-routing.module').then(m => m.ProfileRoutingModule),canActivate: [AuthGuardService]
      },
      {
      path: 'users',
      loadChildren: () => import('./users/users-routing.module').then(m => m.UsersRoutingModule),canActivate: [AuthGuardService]
    }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterviewSchedulerRoutingModule { }
