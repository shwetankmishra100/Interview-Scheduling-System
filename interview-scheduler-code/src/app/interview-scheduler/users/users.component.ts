import { Component } from '@angular/core';
import { HttpApiService } from 'src/app/services/http-api.service';

interface User {
  invitedAt:string;
  invitedBy:string;
  email: string;
  type: string;
  // Add more user properties as needed
}


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  usersData: User[] = [];
  searchText = '';

  constructor(private httpApiService:HttpApiService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(searchQuery:string=''): void {
    this.httpApiService.getUsers(searchQuery).subscribe(
      (data: any) => {
        this.usersData = data.response;
      },
      (error: any) => {
        console.error('Failed to fetch users:', error);
      }
    );
  }

  searchUsers(): void {
    const searchTerm = this.searchText.toLowerCase();
    this.fetchUsers(searchTerm);
  }

  p: number = 1;
}
