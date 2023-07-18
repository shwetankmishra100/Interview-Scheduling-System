import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewInterviewsComponent } from './view-interviews.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'upcoming', pathMatch: 'full' },
      { path: 'upcoming', component: ViewInterviewsComponent },
      { path: 'past', component: ViewInterviewsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewInterviewsRoutingModule { 

}