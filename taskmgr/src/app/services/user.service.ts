import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { User, Project } from '../domain';
import { map, switchMap, reduce, filter } from 'rxjs/operators';

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

  /**
   *查询用户
   *
   * @param {string} filters
   * @returns {Observable<User[]>}
   * @memberof UserService
   */
  searchUsers(filters: string): Observable<User[]> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.get(url, { params: { 'email_like': filters } })
      .pipe(
        map(res => res as User[])
      );
  }

  /**
   *获取所有用户项目
   *
   * @param {string} projectId
   * @returns {Observable<User[]>}
   * @memberof UserService
   */
  getUsersByProject(projectId: string): Observable<User[]> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.get(url, { params: { 'projectId': projectId } })
      .pipe(
        map(res => res as User[])
      );
  }


  /**
   *添加用户项目
   *
   * @param {User} user
   * @param {string} projectId
   * @returns {Observable<User>}
   * @memberof UserService
   */
  addProjectRef(user: User, projectId: string): Observable<User> {
    const url = `${this.config.uri}/${this.domain}/${user.id}`;
    const projectIds = user.projedtIds ? user.projedtIds : [];
    if (projectIds.indexOf(projectId) > -1) {
      return of(user);
    }
    return this.http.patch(url, JSON.stringify({ projectIds: [...projectIds, projectId] }), httpOptions)
      .pipe(
        map(res => res as User)
      );
  }

  /**
   *删除用户项目
   *
   * @param {User} user
   * @param {string} projectId
   * @returns {Observable<User>}
   * @memberof UserService
   */
  removeProjectRef(user: User, projectId: string): Observable<User> {
    const url = `${this.config.uri}/${this.domain}/${user.id}`;
    const projectIds = user.projedtIds ? user.projedtIds : [];
    const index = projectIds.indexOf(projectId);
    if (index === -1) {
      return of(user);
    }
    const toUpdate = [...projectIds.slice(0, index), ...projectIds.slice(index + 1)];
    return this.http.patch(url, JSON.stringify({ projectIds: toUpdate }), httpOptions)
      .pipe(
        map(res => res as User)
      );
  }

  /**
   *批量更新用户项目
   *
   * @param {Project} project
   * @returns {Observable<User[]>}
   * @memberof UserService
   */
  batchUpdateProjectRef(project: Project): Observable<User[]> {
    const projectId = project.id;
    const memberIds = project.members ? project.members : [];
    return from(memberIds)
      .pipe(
        switchMap(id => {
          const url = `${this.config.uri}/${this.domain}/${id}`;
          return this.http.get(url)
            .pipe(
              map(res => res as User)
            );
        }),
        filter(user => user.projedtIds.indexOf(projectId) === -1),
        switchMap(u => this.addProjectRef(u, projectId)),
        reduce((arr: User[], curr: User) => [...arr, curr], [])
      );
  }
}


