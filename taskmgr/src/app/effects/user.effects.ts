import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { map, switchMap, catchError } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import * as actions from '../actions/user.action';


@Injectable()
export class UserEffects {
    @Effect()
    loadUsers$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.LOAD),
        map((a: any) => a.payload),
        switchMap((projectId) => {
            return this.service$.getUsersByProject(projectId).pipe(
                map(users => new actions.LoadSuccessAction(users)),
                catchError(err => of(new actions.LoadFailAction(JSON.stringify(err))))
            );
        })
    );

    @Effect()
    addUserProjectRef$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.ADD),
        map((a: any) => a.payload),
        switchMap(({ user, projectId }) => this.service$.addProjectRef(user, projectId)
            .pipe(
                map(u => new actions.AddSuccessAction(u)),
                catchError(err => of(new actions.AddFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect({ dispatch: false })
    updateUserProjectRef$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.UPDATE),
        map((a: any) => a.payload),
        switchMap((project) => this.service$.batchUpdateProjectRef(project)
            .pipe(
                map(users => new actions.UpdateSuccessAction(users)),
                catchError(err => of(new actions.UpdateFailAction(JSON.stringify(err))))
            ))
    );

    @Effect({ dispatch: false })
    delUserProjectRef$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.DELETE),
        map((a: any) => a.payload),
        switchMap(({ user, projectId }) => this.service$.removeProjectRef(user, projectId)
            .pipe(
                map(u => new actions.DeleteSuccessAction(u)),
                catchError(err => of(new actions.DeleteFailAction(JSON.stringify(err))))
            )
        )
    );

    @Effect({ dispatch: false })
    search$: Observable<Action> = this.actions$
        .pipe(
            ofType(actions.ActionTypes.SEARCH),
            map((a: any) => a.payload),
            switchMap((str) => this.service$.searchUsers(str)
                .pipe(
                    map(users => new actions.SearchSuccessAction(users)),
                    catchError(err => of(new actions.SearchFailAction(JSON.stringify(err))))
                )
            )
        );


    constructor(
        private actions$: Actions,
        private service$: UserService,
    ) {

    }
}
