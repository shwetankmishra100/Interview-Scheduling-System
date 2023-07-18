import { Component } from '@angular/core';
import { HttpApiService } from '../services/http-api.service';
import { User } from '../models/user-model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name: string='';
  email: string='';
 gender:string='';
 userType:string='';
  dob: string=''
  phone: string='';
  company: string='';
  experience: string='';
  ctc: string='';
  resumeLink: string='';
  password: string=''
  confirmPassword:string='';
  error={nameError:'', emailError:'', dobError:'',  phoneError:'', matchPasswordError:'',genderError:'', typeError:''}


constructor(private httpApiService:HttpApiService){}
checkValidation(){
  if(this.password!==''){
    this.error.matchPasswordError='';
    if(this.password!==this.confirmPassword)
      this.error.matchPasswordError="password not matched";
  }else
    this.error.matchPasswordError="please enter password";

  if(this.name==='')
    this.error.nameError="please enter name";
  else
    this.error.nameError="";

  if(this.dob==='')
    this.error.dobError="please enter date of birth";
  else if(this.isValidDate(this.dob))
    this.error.dobError="please enter valid date";
  else
    this.error.dobError="";
  
  if(this.gender==='')
    this.error.genderError="please select one";
  else
    this.error.genderError="";

  if(this.userType==='')
    this.error.typeError="please select one";
  else
    this.error.typeError="";

  if(this.phone==='')
    this.error.phoneError="please enter phone number"
  else if(this.phoneValidator(this.phone)!==true)
    this.error.phoneError="please enter 10 digit valid number";
  else
    this.error.phoneError="";

  if(this.email==='')
    this.error.emailError="please enter email";
  else if(this.isValidEmail(this.email)!==true)
    this.error.emailError="please enter valid email address";
  else
    this.error.emailError="";

  if(this.error.nameError==='' && this.error.emailError==='' && this.error.dobError==='' &&  
  this.error.phoneError==='' && this.error.matchPasswordError==='' 
  &&this.error.genderError==='' && this.error.typeError==='')
    return true;
  else 
    return false;
  }


phoneValidator(phone:string) {
  const phoneRegex = /^[0-9]{10}$/;
  const valid = phoneRegex.test(phone);
  return valid ? true : false;
}
isValidDate(dateString: string): boolean {
  const dateregex = /^\d{2}-\d{2}-\d{4}$/;
  return dateregex.test(dateString);
  }
isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


  signup(){
    console.log(  this.name,
      this.email,
      this.dob,
      this.phone,
      this.company,
      this.experience,
      this.ctc,
      this.resumeLink,
      this.password,this.confirmPassword)
      this.checkValidation();
      try{
        if(this.checkValidation()===true){
          const signupData: User = {
            name: this.name,
            email: this.email,
            gender: this.gender,
            type: this.userType,
            dob: new Date(this.dob).toISOString(),
            phoneNumber: this.phone,
            currentCompany: this.company,
            experience: this.experience,
            currentCTC: this.ctc,
            resumeURL: this.resumeLink,
            password: this.password,
            confirmPassword: this.confirmPassword
          };
          this.httpApiService.registerUser(signupData).subscribe(
            (data) => {
              console.log('Signup success:', data);
            },
            (error) => {
              console.log('Signup error:', error);
            }
          );
        }
      }
      catch(error){
        console.log(error);
      }
  }

}
