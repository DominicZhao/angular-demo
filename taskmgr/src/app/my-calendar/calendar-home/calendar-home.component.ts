import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import { startOfDay, endOfDay } from 'date-fns';
// import {defaultRouteAnim} from '../../anims/';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

const getColor = (priority: number) => {
  switch (priority) {
    case 1:
      return colors.red;
    case 2:
      return colors.blue;
    default:
      return colors.yellow;
  }
};

@Component({
  selector: 'app-calendar-home',
  template: `
  <ng-container *ngIf="(events$ | async) as calEvents">
    <mat-card>
      <div class="toolbar">
        <button mat-icon-button mwlCalendarPreviousView [view]="view$ | async" [(viewDate)]="viewDate">
          <mat-icon class="mat-48">chevron_left</mat-icon>
        </button>
        <button mat-button mwlCalendarToday [(viewDate)]="viewDate">{{viewDate | date: 'yyyy-MM-dd'}}</button>
        <button mat-icon-button mwlCalendarNextView [view]="view$ | async" [(viewDate)]="viewDate">
          <mat-icon class="mat-48">chevron_right</mat-icon>
        </button>
      </div>
      <div [ngSwitch]="view$ | async">
        <mwl-calendar-week-view *ngSwitchCase="'week'"
          [viewDate]="viewDate"
          [events]="calEvents"
          [locale]="locale"
          (eventClicked)="handleEvent($event.event)">

        </mwl-calendar-week-view>
        <mwl-calendar-day-view *ngSwitchCase="'day'"
          [viewDate]="viewDate"
          [events]="calEvents"
          [locale]="locale"
          (eventClicked)="handleEvent($event.event)">

        </mwl-calendar-day-view>
        <mwl-calendar-month-view *ngSwitchDefault
          [viewDate]="viewDate"
          [events]="calEvents"
          [locale]="locale"
          (eventClicked)="handleEvent($event.event)">

        </mwl-calendar-month-view>
      </div>
    </mat-card>
  </ng-container>
  `,
  styles: [`
    .toolbar{
      display: flex;
      flex-direction: row;
    }
    :host{
      width: 100%;
    }
  `],
  // animations: [defaultRouteAnim],
})
export class CalendarHomeComponent implements OnInit {

  public viewDate: Date;
  public view$: Observable<string>;
  public events$: Observable<CalendarEvent[]>;
  public locale = 'zh';

  constructor(
    private route: ActivatedRoute,
    private store$: Store<fromRoot.State>,
    private service$: TaskService
  ) {
    this.viewDate = new Date();
    this.view$ = this.route.paramMap.pipe(
      map(p => p.get('view'))
    );
    this.events$ = this.store$.select(fromRoot.getAuthState)
      .pipe(
        map(auth => auth.user.id),
        switchMap(userId => this.service$.getUserTasks(userId)),
        map(tasks => tasks.map(task => ({
          start: startOfDay(task.creatDate),
          end: endOfDay(task.dueDate),
          title: task.desc,
          color: getColor(task.priority)
        })))
      );
  }

  ngOnInit() {
  }

}
