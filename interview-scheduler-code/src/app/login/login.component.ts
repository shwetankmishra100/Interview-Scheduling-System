import { Component } from '@angular/core';
import { HttpApiService } from '../services/http-api.service';
import { Router } from '@angular/router';
import { AuthGuardService } from '../services/auth-guard.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string='';
  password: string='';
  error={emailError:'', passwordError:''}
  apiError:string='';

  constructor(private router:Router,private httpApiService:HttpApiService,private authGaurdSerive:AuthGuardService) {

   }

   checkValidation(){
     if(this.password!==''){
       this.error.passwordError='';
       }
     else
       this.error.passwordError="please enter password";
   
     if(this.email==='')
       this.error.emailError="please enter email";
     else if(this.isValidEmail(this.email)!==true)
       this.error.emailError="please enter valid email address";
     else
       this.error.emailError="";

      
    if(this.error.emailError==='' && this.error.passwordError==='')
      return true;
    else 
      return false;

   }
   isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  login() {
    try{
      if(this.checkValidation()===true){
        this.httpApiService.login(this.email, this.password).subscribe(
          (data) => {
            console.log('Login success:', data);
            this.httpApiService.sessionId=data.response.sessionId;
            this.authGaurdSerive.sessionId=data.response.sessionId;
            this.httpApiService.type=data.response.type;
            this.httpApiService.curentUserEmail=data.response.email;
            this.router.navigate(['/','interview-scheduler'])
          },
          (error) => {
            console.log('Login error:', error);
            this.apiError=error.error.error.reason;
            // show error message to user
          }
        );
      }
    }
    catch(error){
      console.log(error);
    }
  }
}