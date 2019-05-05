import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task, TaskList } from '../domain';
import { map, mapTo, reduce, mergeMap } from 'rxjs/operators';
import { Observable, concat, from } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private readonly domain = 'tasks';

  constructor(
    private http: HttpClient,
    @Inject('BASE_CONFIG') private config,
  ) { }


  addTask(task: Task): Observable<Task> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.post(url, JSON.stringify(task), httpOptions)
      .pipe(
        map(res => res as Task),
      );
  }


  updateTask(task: Task): Observable<Task> {
    const url = `${this.config.uri}/${this.domain}/${task.id}`;
    const toUpdate = {
      desc: task.desc,
      priority: task.priority,
      dueDate: task.dueDate,
      reminder: task.reminder,
      ownerId: task.ownerId,
      participantIds: task.participantIds,
      remark: task.remark
    };
    return this.http.patch(url, JSON.stringify(toUpdate), httpOptions)
      .pipe(
        map(res => res as Task),
      );
  }


  delTask(task: Task): Observable<Task> {
    const url = `${this.config.uri}/${this.domain}/${task.id}`;
    return this.http.delete(url)
      .pipe(
        mapTo(task)
      );
  }


  getTask(taskListId: string): Observable<Task[]> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.get(url, { params: { 'projectId': taskListId } })
      .pipe(
        map(res => res as Task[])
      );
  }

  getByLists(lists: TaskList[]): Observable<Task[]> {
    return from(lists).pipe(
      mergeMap(list => this.getTask(list.id)),
      reduce((tasks: Task[], t: Task[]) => [...tasks, ...t], [])
    );
  }

  completeTask(task: Task): Observable<Task> {
    const url = `${this.config.uri}/${this.domain}/${task.id}`;
    return this.http.patch(url, JSON.stringify({ completed: !task.completed }), httpOptions)
      .pipe(
        map(res => res as Task),
      );
  }

  moveTask(taskId: string, taskListId: string): Observable<Task> {
    const url = `${this.config.uri}/${this.domain}/${taskId}`;
    return this.http.patch(url, JSON.stringify({ taskListId: taskListId }), httpOptions)
      .pipe(
        map(res => res as Task),
      );
  }

  moveAllTask(srcListId: string, targetListId: string): Observable<Task[]> {
    return this.getTask(srcListId)
      .pipe(
        mergeMap(tasks => from(tasks)),
        mergeMap(task => this.moveTask(task.id, targetListId)),
        reduce((arr: Task[], x: Task) => [...arr, x], [])
      );
  }

  getUserTasks(userId: string): Observable<Task[]> {
    const url = `${this.config.uri}/${this.domain}`;
    return this.http.get(url, { params: { ownerId: userId } })
      .pipe(
        map(res => res as Task[])
      );
  }
}
