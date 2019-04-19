import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, Auth } from '../domain';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // tslint:disable-next-line:max-line-length
  private token = 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySW5mbyI6IntcImhvc3BpdGFsTmFtZVwiOlwi5byY5rOwUElT5rWL6K-VXCIsXCJpZFwiOlwiMVwiLFwibW9iaWxlXCI6XCIxMDA1NDc5ODc1NFwiLFwibW9kdWxhckNvdW50XCI6e1wiMVwiOlwiMjJcIixcIjJcIjpcIjEyXCIsXCIzXCI6XCI4XCIsXCI0XCI6XCIwXCIsXCI1XCI6XCIwXCIsXCI2XCI6XCIwXCIsXCI3XCI6XCIzMlwiLFwiOFwiOlwiNFwifSxcIm5hbWVcIjpcImFkbWluXCIsXCJwZXJtaXNzaW9uc1wiOlt7XCJkZXNjcmlwdGlvblwiOlwi5qCH5pys55m76K6wXCIsXCJpZFwiOlwiMVwiLFwibW9kdWxhcklkXCI6MX0se1wiZGVzY3JpcHRpb25cIjpcIueXheS-i-ajgOafpeeUs-ivt-WNlVwiLFwiaWRcIjpcIjJcIixcIm1vZHVsYXJJZFwiOjJ9LHtcImRlc2NyaXB0aW9uXCI6XCLmoIfmnKzlj5bmnZBcIixcImlkXCI6XCIzXCIsXCJtb2R1bGFySWRcIjozfSx7XCJkZXNjcmlwdGlvblwiOlwi5p2Q5Z2X5YyF5Z-LXCIsXCJpZFwiOlwiNFwiLFwibW9kdWxhcklkXCI6NH0se1wiZGVzY3JpcHRpb25cIjpcIuWIh-eJh-afk-iJslwiLFwiaWRcIjpcIjVcIixcIm1vZHVsYXJJZFwiOjV9LHtcImRlc2NyaXB0aW9uXCI6XCLmlbDlrZfliIfniYdcIixcImlkXCI6XCI2XCIsXCJtb2R1bGFySWRcIjo2fSx7XCJkZXNjcmlwdGlvblwiOlwi5oql5ZGK566h55CGXCIsXCJpZFwiOlwiOFwiLFwibW9kdWxhcklkXCI6OH0se1wiZGVzY3JpcHRpb25cIjpcIuW9kuaho-euoeeQhlwiLFwiaWRcIjpcIjlcIixcIm1vZHVsYXJJZFwiOjl9LHtcImRlc2NyaXB0aW9uXCI6XCLotKjmjqfnrqHnkIZcIixcImlkXCI6XCIxMFwiLFwibW9kdWxhcklkXCI6MTB9XSxcInJvbGVzXCI6W3tcImNvZGVcIjo0LFwiZGVzY3JpcHRpb25cIjpcIueuoeeQhuWRmFwiLFwiaWRcIjpcIjRcIn1dLFwidXNlck5hbWVcIjpcIueuoeeQhuWRmFwifSIsInN1YiI6ImFkbWluIiwiZXhwIjoxNTU1NTU2ODcyLCJpYXQiOjE1NTQ5NTIwNzJ9.oWSq1Q45FKPb0f0vuhFdXS6fDOq85Qz-V3qiblJlWNjBi4Y3cuwFpN-E4U5WF5KeGuuP2-Df3nGpruqLPakDjA';
  private readonly domain = 'users';

  constructor(
    private http: HttpClient,
    @Inject('BASE_CONFIG') private config,
  ) { }

  /**
   *注册
   *
   * @param {User} user
   * @returns {Observable<Auth>}
   * @memberof AuthService
   */
  register(user: User): Observable<Auth> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.get(url, { params: { 'email': user.email } })
      .pipe(
        switchMap(res => {
          if (Object.keys(res).length > 0) {
            throw new Error('user existed');
          }
          return this.http.post(url, JSON.stringify(user), httpOptions)
            .pipe(
              map(data => ({ token: this.token, user: data } as Auth))
            );
        })
      );
  }

  /**
   *登录
   *
   * @param {string} username
   * @param {string} password
   * @returns {Observable<Auth>}
   * @memberof AuthService
   */
  login(username: string, password: string): Observable<Auth> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.get(url, { params: { 'email': username, 'password': password } })
      .pipe(
        map(res => {
          if (Object.keys(res).length === 0) {
            throw new Error('username or password not match');
          }
          return {
            token: this.token,
            user: res[0]
          };
        })
      );
  }
}
