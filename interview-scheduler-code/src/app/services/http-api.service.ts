import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user-model';


@Injectable({
  providedIn: 'root'
})
export class HttpApiService {
  createInterview(interviewData: { user1: string; user2: string; date: () => string; duration: string; startTime: string; endTime: string; }) {
    throw new Error('Method not implemented.');
  }
  // private apiUrl = 'http://192.168.29.70:31000';
  private apiUrl = 'http://localhost:31000';

  constructor(private http: HttpClient) { }
  sessionId:string='';
  type:string='';
  curentUserEmail:string=''
  
  getOptions(sessionId:string, params:any={}){
    return {
      headers: {
        "session-id":sessionId
      },
      params: params
    };
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password });
  }

  logout(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/logout`, this.getOptions(this.sessionId));
  }

  getInterviews(interviewType:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/scheduler/list${interviewType}Schedules`, this.getOptions(this.sessionId));
  }

  setInterview(interview: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/scheduler/schedule/`, interview,this.getOptions(this.sessionId));
  }

  // updateInterview(interview: any): Observable<any> {
  //   return this.http.put<any>(`${this.apiUrl}/${interview.id}`, interview);
  // }

  deleteInterview(scheduleId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/scheduler/delete`, this.getOptions(this.sessionId, {scheduleId:scheduleId }));
  }

  getUsers(searchQuery:string){
    return this.http.get<any>(`${this.apiUrl}/user/list`, this.getOptions(this.sessionId,{page:1,pageSize:100,searchText:searchQuery}));
  }

  registerUser(data:User){
    return this.http.post<User>(`${this.apiUrl}/auth/signup`, data);
  }

  fetchUserdata(userEmail:string){
    return this.http.get<User>(`${this.apiUrl}/user/fetchUser`,this.getOptions(this.sessionId,{email:userEmail}));
  }

  verifyUserExistence(userEmail:string){
    return this.http.get(`${this.apiUrl}/user/verifyUserExists`,this.getOptions(this.sessionId,{email:userEmail}));
  }
  inviteUser(userEmail:string){
    return this.http.get(`${this.apiUrl}/user/inviteUser`,this.getOptions(this.sessionId,{email:userEmail}));
  }

}
