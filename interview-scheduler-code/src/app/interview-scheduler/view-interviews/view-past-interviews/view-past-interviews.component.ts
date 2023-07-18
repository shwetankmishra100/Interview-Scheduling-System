import { Component, EventEmitter, Output } from '@angular/core';
import { HttpApiService } from 'src/app/services/http-api.service';

@Component({
  selector: 'app-view-past-interviews',
  template: '<h2 class="text-3xl font-bold mb-5">Past Interviews</h2>'
})
export class ViewPastInterviewsComponent {
 
  @Output() pastInterviewListChange = new EventEmitter<any[]>();
  constructor(private httpApiService:HttpApiService){}
  ngOnInit(){

    this.httpApiService.getInterviews('Past').subscribe(
      (data) => {
        const pastInterviewList = data.response;
        this.pastInterviewListChange.emit(pastInterviewList);
      },
      (error) => {
        console.log("Error",error);
      }
    );
  }
}
