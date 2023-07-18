import { Component } from '@angular/core';
import { HttpApiService } from '../services/http-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interview-scheduler',
  templateUrl: './interview-scheduler.component.html',
  styleUrls: ['./interview-scheduler.component.css']
})

export class InterviewSchedulerComponent {
  type: string = '';
  constructor(private httpApiService: HttpApiService, private router: Router) { }
  ngOnInit() {
    this.type = this.httpApiService.type;
  }


  viewUpcomingInterview() {
    this.router.navigate(['/', 'interview-scheduler', 'view-interviews', 'upcoming']);
  }

  viewPastInterview() {
    this.router.navigate(['/', 'interview-scheduler', 'view-interviews', 'past']);
  }

  listUsers() {
    this.router.navigate(['/', 'interview-scheduler', 'users']);
  }
  showProfile() {
    this.router.navigate(['/', 'interview-scheduler', 'profile']);
  }
  scheduleInterview() {
    this.router.navigate(['/', 'interview-scheduler', 'schedule-interview']);
  }
  logout() {
    this.httpApiService.logout().subscribe(
      data => {
        // If the logout request is successful, navigate to the login page
        this.router.navigate(['/login']);
      },
      error => {
        console.log(error);
      }
    );
  }
}
