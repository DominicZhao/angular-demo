import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../domain';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly domain = 'users';

  constructor(
    private http: HttpClient,
    @Inject('BASE_CONFIG') private config,
  ) { }

  searchUsers(filter: string) Observable<User[]> {

  }
}

