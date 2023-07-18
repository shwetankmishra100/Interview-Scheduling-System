import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpApiService } from 'src/app/services/http-api.service';

@Component({
  selector: 'app-view-interviews',
  templateUrl: './view-interviews.component.html',
  styleUrls: ['./view-interviews.component.css']
})
export class ViewInterviewsComponent {

  upcomingInterviewList: any[] = [];

  pastInterviewList: any[] = [];
  isPastRoute: boolean=false;
  isUpcomingRoute: boolean=false;
  type:string='';


  constructor(private route: ActivatedRoute,private httpApiService:HttpApiService) {}

  ngOnInit() {
    this.route.url.subscribe(urlSegments => {
      // Check if the current route contains the 'past' segment
      this.isPastRoute = urlSegments.some(segment => segment.path === 'past');
      this.isUpcomingRoute = urlSegments.some(segment => segment.path === 'upcoming');
    });
    this.type=this.httpApiService.type;
  }

  receiveUpcomingInterviewList(interviewList: any[]) {
    this.upcomingInterviewList = interviewList.map((interview) => {
      return {
        ...interview,
        scheduledFrom: (new Date(interview.scheduledFrom)).toLocaleString("en-US", {timeZone:'Asia/Kolkata'}),
        scheduledTo: (new Date(interview.scheduledTo)).toLocaleString("en-US", {timeZone:'Asia/Kolkata'})
      }
    });
  }
  receivePastInterviewList(interviewList: any[]) {
    this.pastInterviewList = interviewList.map((interview) => {
      return {
        ...interview,
        scheduledFrom: (new Date(interview.scheduledFrom)).toLocaleString("en-US", {timeZone:'Asia/Kolkata'}),
        scheduledTo: (new Date(interview.scheduledTo)).toLocaleString("en-US", {timeZone:'Asia/Kolkata'})
      }
    });
  }

  deleteInterview(id:string){
    this.httpApiService.deleteInterview(id).subscribe(
      () => {
        console.log('Interview deleted successfully');
        this.upcomingInterviewList = this.upcomingInterviewList.filter(interview => interview.scheduleId !== id);
      },
      (error) => {
        console.error('Error deleting interview:', error);
      }
    );
  }

  goToMeetingLink(meetingLink: string) {
    const url=`https://meet.google.com/${meetingLink}`
    window.open(url, '_blank');
  }

  p: number = 1;
}
