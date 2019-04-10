import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Project } from '../domain';
import { map, mergeMap, count, switchMap, mapTo } from 'rxjs/operators';
import { Observable, from } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})

export class ProjectService {

  private readonly domain = 'projects';

  constructor(
    private http: HttpClient,
    @Inject('BASE_CONFIG') private config,
  ) {}

  /**
   *添加project
   *
   * @param {Project} project
   * @memberof ProjectService
   */
  addProject(project: Project): Observable<Project> {
    project.id = null;
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.post(url, JSON.stringify(project), httpOptions)
      .pipe(
        map(res => res as Project),
      );
  }

  /**
   *更新project
   *
   * @param {Project} project
   * @returns {Observable<Project>}
   * @memberof ProjectService
   */
  updateProject(project: Project): Observable<Project> {
    const url = `${this.config.uri}/${this.domain}/${project.id}`;
    const toUpdate = {
      name: project.name,
      desc: project.desc,
      coverImg: project.coverImg
    };
    return this.http.patch(url, JSON.stringify(toUpdate), httpOptions)
      .pipe(
        map(res => res as Project),
      );
  }

  /**
   *删除项目
   *
   * @param {Project} project
   * @returns {Observable<Project>}
   * @memberof ProjectService
   */
  delProject(project: Project): Observable<Project> {
    const delTakes$ = from(project.taskLists ? project.taskLists : []).pipe(
      mergeMap(listId => this.http.delete(`${this.config.uri}/taskLists/${listId}`)),
      count()
    );

    return delTakes$.pipe(
      switchMap(_ => this.http.delete(`${this.config.uri}/${this.domain}/${project.id}`)),
      mapTo(project)
    );
  }

  /**
   *获取项目列表
   *
   * @param {string} userId
   * @returns {Observable<Project[]>}
   * @memberof ProjectService
   */
  getProjectList(userId: string): Observable<Project[]> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.get(url, {params: {'members_like': userId}})
      .pipe(
        map(res => res as Project[])
      );
  }
}
