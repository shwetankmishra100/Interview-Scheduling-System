import { Component, EventEmitter, Output } from '@angular/core';
import { HttpApiService } from 'src/app/services/http-api.service';

@Component({
  selector: 'app-view-upcoming-interviews',
  template:'<h2 class="text-3xl font-bold mb-5">Upcoming Interviews</h2>'
})
export class ViewUpcomingInterviewsComponent {
  
  @Output() upcomingInterviewListChange = new EventEmitter<any[]>();

  constructor(private httpApiService:HttpApiService){}
  ngOnInit(){

    this.httpApiService.getInterviews('Upcoming').subscribe(
      (data) => {
        const upcomingInterviewList = data.response;
        this.upcomingInterviewListChange.emit(upcomingInterviewList);
      },
      (error) => {
        console.log("Error",error);
      }
    );
    
  }
}
