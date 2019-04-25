import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { map, switchMap, catchError } from 'rxjs/operators';
import { TaskService } from '../services/task.service';
import * as actions from '../actions/task.action';


@Injectable()
export class TaskEffects {
    @Effect()
    loadTasks$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.LOAD),
        map((a: any) => a.payload),
        switchMap((taskLists) => {
            return this.service$.getByLists(taskLists).pipe(
                map(tasks => new actions.LoadSuccessAction(tasks)),
                catchError(err => of(new actions.LoadFailAction(JSON.stringify(err))))
            );
        })
    );

    @Effect()
    addTasks$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.ADD),
        map((a: any) => a.payload),
        switchMap((task) => this.service$.addTask(task)
            .pipe(
                map(t => new actions.AddSuccessAction(t)),
                catchError(err => of(new actions.AddFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect({ dispatch: false })
    updateTasks$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.UPDATE),
        map((a: any) => a.payload),
        switchMap((task) => this.service$.updateTask(task)
            .pipe(
                map(t => new actions.UpdateSuccessAction(t)),
                catchError(err => of(new actions.UpdateFailAction(JSON.stringify(err))))
            ))
    );

    @Effect({ dispatch: false })
    delTasks$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.DELETE),
        map((a: any) => a.payload),
        switchMap((task) => this.service$.delTask(task).pipe(
            map(t => new actions.DeleteSuccessAction(t)),
            catchError(err => of(new actions.DeleteFailAction(JSON.stringify(err))))
        ))
    );

    @Effect({ dispatch: false })
    completeTask$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.COMPLETE),
        map((a: any) => a.payload),
        switchMap((task) => this.service$.completeTask(task).pipe(
            map(t => new actions.CompleteSuccessAction(t)),
            catchError(err => of(new actions.CompleteFailAction(JSON.stringify(err))))
        ))
    );

    @Effect({ dispatch: false })
    move$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.MOVE),
        map((a: any) => a.payload),
        switchMap(({taskId, taskListId}) => this.service$.moveTask(taskId, taskListId).pipe(
            map(task => new actions.MoveSuccessAction(task)),
            catchError(err => of(new actions.MoveFailAction(JSON.stringify(err))))
        ))
    );

    @Effect({ dispatch: false })
    moveAll$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.MOVE_ALL),
        map((a: any) => a.payload),
        switchMap(({srcListId, targetListId}) => this.service$.moveAllTask(srcListId, targetListId).pipe(
            map(tasks => new actions.MoveAllSuccessAction(tasks)),
            catchError(err => of(new actions.MoveAllFailAction(JSON.stringify(err))))
        ))
    );


    constructor(
        private actions$: Actions,
        private service$: TaskService,
    ) {

    }
}
