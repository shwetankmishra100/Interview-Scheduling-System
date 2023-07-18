import { Component } from '@angular/core';
import { User } from 'src/app/models/user-model';
import { HttpApiService } from 'src/app/services/http-api.service';

@Component({
  selector: 'app-schedule-interview',
  templateUrl: './schedule-interview.component.html',
  styleUrls: ['./schedule-interview.component.css']
})
export class ScheduleInterviewComponent {
  user1: string = '';
  user2: string = '';
  date: string = '';
  time: string = '';
  duration: string = '';
  durationOptions: string[] = [];
  error = { user1EmailError: '', user2EmailError: '', dateError: '', timeError: '', durationError: '' }

  showUser1:boolean=false;
  showUser2:boolean=false;

  showInviteToggle1:boolean=false;
  showInviteToggle2:boolean=false;

  inviteStatus1:boolean=true;
  inviteStatus2:boolean=true;


  constructor(private httpApiService: HttpApiService) { }
  ngOnInit(): void {
    // Generate options for duration select dropdown
    for (let i = 30; i <= 240; i += 30) {
      this.durationOptions.push(i.toString());
    }
  }

  calculateEndTime(startTime: string, durationInMinutes: number): string {
    const [hours, minutes] = startTime.split(':').map(Number);
    const startTimeInMinutes = hours * 60 + minutes;
    const endTimeInMinutes = startTimeInMinutes + durationInMinutes;
    const hoursWithLeadingZero = Math.floor(endTimeInMinutes / 60)
      .toString()
      .padStart(2, '0');
    const minutesWithLeadingZero = (endTimeInMinutes % 60).toString().padStart(2, '0');
    return `${hoursWithLeadingZero}:${minutesWithLeadingZero}`;
  }

  checkValidation(): boolean {
    if (this.date !== '') {
      this.error.dateError = '';
    }
    else
      this.error.dateError = "please enter date";

    if (this.time !== '') {
      this.error.timeError = '';
    }
    else
      this.error.timeError = "please enter time";

    if (this.duration !== '') {
      this.error.durationError = '';
    }
    else
      this.error.durationError = "please enter duration";

    if (this.user1 === '')
      this.error.user1EmailError = "please enter email of user1";
    else if (this.isValidEmail(this.user1) !== true)
      this.error.user1EmailError = "please enter valid email address";
    else
      this.error.user1EmailError = "";

    if (this.user2 === '')
      this.error.user2EmailError = "please enter email of user2";
    else if (this.isValidEmail(this.user2) !== true)
      this.error.user2EmailError = "please enter valid email address";
    else
      this.error.user2EmailError = "";


    if (this.error.user1EmailError === '' && this.error.user2EmailError === '' && this.error.durationError === '' && this.error.timeError === '' && this.error.dateError === '')
      return true;
    else
      return false;

  }
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }





  name1: string = "";
  email1: string = "";
  dob1: string = "";
  phoneNumber1: string = "";
  gender1: string = "";
  currentCompany1: string = "";
  experience1: string = "";
  currentCTC1: string = "";
  resumeURL1: string = "";

  name2: string = "";
  email2: string = "";
  dob2: string = "";
  phoneNumber2: string = "";
  gender2: string = "";
  currentCompany2: string = "";
  experience2: string = "";
  currentCTC2: string = "";
  resumeURL2: string = "";





  fetchUser1Details(event: any): void {
    const inputElement: HTMLInputElement = event.target;
    const value = inputElement.value;
    this.user1=value;
    this.fetchDetails1(this.user1);
  };
  fetchDetails1(userEmail: string) {
    this.httpApiService.fetchUserdata(userEmail).subscribe(
      (data: any) => {
        data = data.response;
        try{
        this.inviteStatus1=data.inviteAccepted;
        this.name1 = data.name || " ";
        this.email1 = data.email || " ";
        this.dob1 = data.dob.substring(0, 10) || " ";
        this.gender1 = data.gender || " ";
        this.phoneNumber1 = data.phoneNumber || " ";
        this.currentCompany1 = data.currentCompany || " ";
        this.experience1 = data.experience || " ";
        this.currentCTC1 = data.currentCTC || " ";
        this.resumeURL1 = data.resumeURL || " ";
        this.showUser1=true;
        this.showInviteToggle1=false;
        
        if(this.inviteStatus1===false){
          this.showUser1=false;
          this.inviteStatus1=false;
          console.log("invite1",this.inviteStatus1)
        }
       }
       catch{
        this.showInviteToggle1=false;
       }
        
      },
      (error) => {
        console.log(error);
        if(userEmail!=="")
          this.showInviteToggle1=true;
          this.showUser1=false;
          this.inviteStatus1=true;

      }
    )
  }

  fetchUser2Details(event: any): void {
    const inputElement: HTMLInputElement = event.target;
    const value = inputElement.value;
    this.user2=value;
    this.fetchDetails2(this.user2);
  };
  fetchDetails2(userEmail: string) {
    this.httpApiService.fetchUserdata(userEmail).subscribe(
      (data: any) => {
        data = data.response;
       try{
        this.inviteStatus2=data.inviteAccepted;
        this.name2 = data.name ? data.name:" ";
        this.email2 = data.email ? data.email:" ";
        this.dob2 = data.dob.substring(0, 10)?data.dob.substring(0, 10):" ";
        this.gender2 = data.gender ?data.gender  :" ";
        this.phoneNumber2 = data.phoneNumber ? data.phoneNumber:" ";
        this.currentCompany2 = data.currentCompany ?data.currentCompany :" ";
        this.experience2 = data.experience ? data.experience :" ";
        this.currentCTC2 = data.currentCTC ? data.currentCTC :" ";
        this.resumeURL2 = data.resumeURL ? data.resumeURL:" ";
        this.showUser2=true;
        this.showInviteToggle2=false;
        
        if(this.inviteStatus2===false){
          this.showUser2=false;
          this.inviteStatus2=false;
          console.log("invite2",this.inviteStatus2)

        }
       }
       catch{
        this.showInviteToggle2=false;
       }
        
      },
      (error) => {
        console.log(error);
        if(userEmail!=="")
          this.showInviteToggle2=true;
          this.showUser2=false;
          this.inviteStatus2=true;

      }
    )
  }
  

  inviteUser1(userEmail:string){
    this.httpApiService.inviteUser(userEmail).subscribe(
      (data)=>{
        console.log("user invite sucessfully send");
        this.inviteStatus1=!true;
        this.showInviteToggle1=false
      },
      (error)=>{
        this.inviteStatus1=true;
        console.log(error);
      }
    );
  }
  inviteUser2(userEmail:string){
    this.httpApiService.inviteUser(userEmail).subscribe(
      (data)=>{
        console.log("user invite sucessfully send");
        this.inviteStatus2=!true;
        this.showInviteToggle2=false
      },
      (error)=>{
        this.inviteStatus2=true;
        console.log(error);
      }
    );
  }

  scheduleInterview() {
    const interviewData = {
      user1Email: this.user1,
      user2Email: this.user2,
      date: new Date(this.date).toISOString(),
      duration: this.duration,
      time:this.time
    };
    const valid = this.checkValidation();
    if(valid){
      console.log(this.date, interviewData)
      this.httpApiService.setInterview(interviewData).subscribe(
        (response:any) => {
          console.log('Interview created successfully:', response);
        },
        (error) => {
          console.log('Error creating interview:', error);
        }
      );
    }




    // console.log(interviewData.user1);
    // console.log(interviewData.user2);
    // console.log(interviewData.date);
    // console.log(interviewData.duration);
    // console.log(interviewData.startTime);
    // console.log(interviewData.endTime);
    // console.log("valid=", valid);



  }
}
