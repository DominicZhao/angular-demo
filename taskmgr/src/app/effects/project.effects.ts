import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { map, switchMap, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { ProjectService } from '../services/project.service';
import * as actions from '../actions/project.action';
import * as listActions from '../actions/task-list.action';
import * as fromRoot from '../reducers';


@Injectable()
export class ProjectEffects {
    @Effect()
    loadProjects$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.LOAD),
        map((a: any) => a.payload),
        withLatestFrom(this.store$.select(fromRoot.getAuthState)),
        switchMap(([_, auth]) => {
            return this.service$.getProjectList(auth.user.id).pipe(
                map(projects => new actions.LoadSuccessAction(projects)),
                catchError(err => of(new actions.LoadFailAction(JSON.stringify(err))))
            );
        })
    );

    @Effect()
    addProjects$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.ADD),
        map((a: any) => a.payload),
        withLatestFrom(this.store$.select(fromRoot.getAuthState)),
        switchMap(([projects, auth]) => {
            const added = { ...projects, members: [`${auth.user.id}`] };
            return this.service$.addProject(added).pipe(
                map(project => new actions.AddSuccessAction(project)),
                catchError(err => of(new actions.AddFailAction(JSON.stringify(err))))
            );
        })
    );

    @Effect({ dispatch: false })
    updateProjects$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.UPDATE),
        map((a: any) => a.payload),
        switchMap((project) => this.service$.updateProject(project).pipe(
            map(projects => new actions.UpdateSuccessAction(projects)),
            catchError(err => of(new actions.UpdateFailAction(JSON.stringify(err))))
        ))
    );

    @Effect({ dispatch: false })
    delProjects$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.DELETE),
        map((a: any) => a.payload),
        switchMap((project) => this.service$.delProject(project).pipe(
            map(projects => new actions.DeleteSuccessAction(projects)),
            catchError(err => of(new actions.DeleteFailAction(JSON.stringify(err))))
        ))
    );

    @Effect({ dispatch: false })
    invite$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.INVITE),
        map((a: any) => a.payload),
        switchMap(({ projectId, members }) => this.service$.invite(projectId, members).pipe(
            map(project => new actions.InviteSuccessAction(project)),
            catchError(err => of(new actions.InviteFailAction(JSON.stringify(err))))
        ))
    );

    @Effect({ dispatch: false })
    selectProject$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.SELECT_PROJECT),
        map((a: any) => a.payload),
        tap(project => this.router.navigate([`/tasklists/${project.id}`]))
    );

    // @Effect({ dispatch: false })
    // loadTaskLists$: Observable<Action> = this.actions$.pipe(
    //     ofType(actions.ActionTypes.SELECT_PROJECT),
    //     map((a: any) => a.payload),
    //     tap(project => new listActions.LoadAction(project.id))
    // );


    constructor(
        private actions$: Actions,
        private service$: ProjectService,
        private router: Router,
        private store$: Store<fromRoot.State>
    ) {

    }
}
