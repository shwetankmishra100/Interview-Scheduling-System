import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScheduleInterviewComponent } from './schedule-interview.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleInterviewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleInterviewRoutingModule { }