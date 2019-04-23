import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { map, switchMap, catchError } from 'rxjs/operators';
import { TaskListService } from '../services/task-list.service';
import * as actions from '../actions/task-list.action';
import * as fromRoot from '../reducers';


@Injectable()
export class TaskListEffects {
    @Effect()
    loadTaskLists$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.LOAD),
        map((a: any) => a.payload),
        switchMap((projectId) => {
            console.log(projectId);
            return this.service$.getTaskList(projectId).pipe(
                map(taskLists => new actions.LoadSuccessAction(taskLists)),
                catchError(err => of(new actions.LoadFailAction(JSON.stringify(err))))
            );
        })
    );

    @Effect()
    addTaskLists$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.ADD),
        map((a: any) => a.payload),
        switchMap((taskList) => this.service$.addTaskList(taskList)
            .pipe(
                map(tl => new actions.AddSuccessAction(tl)),
                catchError(err => of(new actions.AddFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect({ dispatch: false })
    updateTaskLists$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.UPDATE),
        map((a: any) => a.payload),
        switchMap((taskList) => this.service$.updateTaskList(taskList)
            .pipe(
                map(tl => new actions.UpdateSuccessAction(tl)),
                catchError(err => of(new actions.UpdateFailAction(JSON.stringify(err))))
            ))
    );

    @Effect({ dispatch: false })
    delTaskLists$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.DELETE),
        map((a: any) => a.payload),
        switchMap((taskList) => this.service$.delTaskList(taskList).pipe(
            map(tl => new actions.DeleteSuccessAction(tl)),
            catchError(err => of(new actions.DeleteFailAction(JSON.stringify(err))))
        ))
    );

    @Effect({ dispatch: false })
    swap$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.SWAP),
        map((a: any) => a.payload),
        switchMap(({ src, target }) => this.service$.swapOrder(src, target).pipe(
            map(taskLists => new actions.SwapSuccessAction(taskLists)),
            catchError(err => of(new actions.SwapFailAction(JSON.stringify(err))))
        ))
    );


    constructor(
        private actions$: Actions,
        private service$: TaskListService,
        private router: Router,
        private store$: Store<fromRoot.State>
    ) {

    }
}
