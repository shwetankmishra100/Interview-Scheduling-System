import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms';
import { HttpApiService } from './services/http-api.service';
import { SignupComponent } from './signup/signup.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';
import { InterviewSchedulerComponent } from './interview-scheduler/interview-scheduler.component';
import { ViewInterviewsComponent } from './interview-scheduler/view-interviews/view-interviews.component';
import { ScheduleInterviewComponent } from './interview-scheduler/schedule-interview/schedule-interview.component';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './interview-scheduler/profile/profile.component';
import { ViewUpcomingInterviewsComponent } from './interview-scheduler/view-interviews/view-upcoming-interviews/view-upcoming-interviews.component';
import { ViewPastInterviewsComponent } from './interview-scheduler/view-interviews/view-past-interviews/view-past-interviews.component';
import { UsersComponent } from './interview-scheduler/users/users.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    InterviewSchedulerComponent,
    ViewInterviewsComponent,
    ScheduleInterviewComponent,
    ProfileComponent,
    ViewUpcomingInterviewsComponent,
    ViewPastInterviewsComponent,
    UsersComponent
    ],
  imports: [
    BrowserModule,
    NgxPaginationModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [HttpApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
