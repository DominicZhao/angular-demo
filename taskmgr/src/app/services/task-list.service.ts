import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TaskList } from '../domain';
import { map, mapTo, reduce } from 'rxjs/operators';
import { Observable, concat } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};
@Injectable({
  providedIn: 'root'
})
export class TaskListService {

  private readonly domain = 'taskLists';

  constructor(
    private http: HttpClient,
    @Inject('BASE_CONFIG') private config,
  ) { }


  addTaskList(taskList: TaskList): Observable<TaskList> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.post(url, JSON.stringify(taskList), httpOptions)
      .pipe(
        map(res => res as TaskList),
      );
  }


  updateTaskList(taskList: TaskList): Observable<TaskList> {
    const url = `${this.config.uri}/${this.domain}/${taskList.id}`;
    const toUpdate = {
      name: taskList.name
    };
    return this.http.patch(url, JSON.stringify(toUpdate), httpOptions)
      .pipe(
        map(res => res as TaskList),
      );
  }


  delTaskList(taskList: TaskList): Observable<TaskList> {
    const url = `${this.config.uri}/${this.domain}/${taskList.id}`;
    return this.http.delete(url)
      .pipe(
        mapTo(taskList)
      );
  }


  getTaskList(projectId: string): Observable<TaskList[]> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.get(url, { params: { 'projectId': projectId } })
      .pipe(
        map(res => res as TaskList[])
      );
  }

  swapOrder(src: TaskList, target: TaskList): Observable<TaskList[]> {
    const dragUrl = `${this.config.uri}/${this.domain}/${src.id}`;
    const dropUrl = `${this.config.uri}/${this.domain}/${target.id}`;
    const drag$ = this.http.patch(dragUrl, JSON.stringify({ order: target.order }), httpOptions);
    const drop$ = this.http.patch(dropUrl, JSON.stringify({ order: src.order }), httpOptions);
    return concat(drag$, drop$).pipe(
      reduce((arrs, list) => [...arrs, list], [])
    );
  }
}
