import { Component } from '@angular/core';
import { User } from 'src/app/models/user-model';
import { HttpApiService } from 'src/app/services/http-api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  name: string='';
  email: string='';
  dob: string='';
  phone: string='';
  gender:string='';
  company: string='';
  experience: string='';
  ctc: string='';
  resumeLink: string='';


  constructor(private httpApiService:HttpApiService){}

  ngOnInit(){
    this.fetchCurrentUser(this.httpApiService.curentUserEmail);
  }

  fetchCurrentUser(userEmail:string){
    this.httpApiService.fetchUserdata(userEmail).subscribe(
      (data:any)=>{
        data = data.response;
        this.name=data.name || " ";
        this.email=data.email || " ";
        this.dob= data.dob.substring(0,10)|| " ";
        this.gender=data.gender || " ";
        this.phone=data.phoneNumber || " ";
        this.company=data.currentCompany || " ";
        this.experience=data.experience || " ";
        this.ctc=data.currentCTC || " ";
        this.resumeLink=data.resumeURL || " ";
      },
      (error)=>{
        console.log(error);
      }
    )
  }
}
