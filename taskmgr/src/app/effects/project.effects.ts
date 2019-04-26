import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of, from } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { map, switchMap, catchError, tap, withLatestFrom } from 'rxjs/operators';
import { ProjectService } from '../services/project.service';
import * as actions from '../actions/project.action';
import * as listActions from '../actions/task-list.action';
import * as userActions from '../actions/user.action';
import * as fromRoot from '../reducers';
import { Project } from '../domain';


@Injectable()
export class ProjectEffects {
    @Effect()
    loadProjects$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.LOAD),
        map((a: any) => a.payload),
        withLatestFrom(this.store$.select(fromRoot.getAuthState)
            .pipe(
                map(auth => auth.user)
            )
        ),
        switchMap(([_, user]) => {
            return this.service$.getProjectList(user.id).pipe(
                map(projects => new actions.LoadSuccessAction(projects)),
                catchError(err => of(new actions.LoadFailAction(JSON.stringify(err))))
            );
        })
    );

    @Effect()
    addProjects$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.ADD),
        map((a: any) => a.payload),
        withLatestFrom(this.store$.select(fromRoot.getAuthState)
            .pipe(
                map(auth => auth.user)
            )
        ),
        switchMap(([projects, user]) => {
            const added = { ...projects, members: [`${user.id}`] };
            return this.service$.addProject(added).pipe(
                map(project => new actions.AddSuccessAction(project)),
                catchError(err => of(new actions.AddFailAction(JSON.stringify(err))))
            );
        })
    );

    @Effect()
    updateProjects$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.UPDATE),
        map((a: any) => a.payload),
        switchMap((project) => this.service$.updateProject(project).pipe(
            map(projects => new actions.UpdateSuccessAction(projects)),
            catchError(err => of(new actions.UpdateFailAction(JSON.stringify(err))))
        ))
    );

    @Effect()
    delProjects$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.DELETE),
        map((a: any) => a.payload),
        switchMap((project) => this.service$.delProject(project).pipe(
            map(projects => new actions.DeleteSuccessAction(projects)),
            catchError(err => of(new actions.DeleteFailAction(JSON.stringify(err))))
        ))
    );

    @Effect()
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

    @Effect()
    loadTaskLists$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.SELECT_PROJECT),
        map((a: any) => a.payload),
        map(project => new listActions.LoadAction(project.id))
    );

    @Effect()
    loadUser$: Observable<Action> = this.actions$
        .pipe(
            ofType(actions.ActionTypes.LOAD_SUCCESS),
            map((a: any) => a.payload),
            switchMap((projects: Project[]) => from(projects.map(prj => prj.id))),
            map(projectId => new userActions.LoadAction(projectId))
        );

    @Effect()
    addUserProject$: Observable<Action> = this.actions$
        .pipe(
            ofType(actions.ActionTypes.ADD_SUCCESS),
            map((a: any) => a.payload),
            map(project => project.id),
            withLatestFrom(this.store$.select(fromRoot.getAuthState)
                .pipe(
                    map(auth => auth.user)
                ), (projectId, user) => {
                    return new userActions.AddAction({ user: user, projectId: projectId });
                }
            )
        );

    @Effect()
    removeUserProject$: Observable<Action> = this.actions$
        .pipe(
            ofType(actions.ActionTypes.DELETE_SUCCESS),
            map((a: any) => a.payload),
            map(project => project.id),
            withLatestFrom(this.store$.select(fromRoot.getAuthState)
                .pipe(
                    map(auth => auth.user)
                ), (projectId, user) => {
                    return new userActions.DeleteAction({ user: user, projectId: projectId });
                }
            )
        );

    @Effect()
    updateUserProject$: Observable<Action> = this.actions$
        .pipe(
            ofType(actions.ActionTypes.INVITE_SUCCESS),
            map((a: any) => a.payload),
            map(project => new userActions.UpdateAction(project)),
        );


    constructor(
        private actions$: Actions,
        private service$: ProjectService,
        private router: Router,
        private store$: Store<fromRoot.State>
    ) {

    }
}
