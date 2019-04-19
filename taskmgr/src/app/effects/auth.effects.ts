import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import * as actions from '../actions/auth.action';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { User } from '../domain';

@Injectable()
export class AuthEffects {
    @Effect()
    login$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.LOGIN),
        map((a: any) => a.payload),
        switchMap(({email, password}) => this.service$.login(email, password).pipe(
            map(auth => new actions.LoginSuccessAction(auth)),
            catchError(err => of(new actions.LoginFailAction(JSON.stringify(err))))
        ))
    );

    @Effect()
    register$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.REGISTER),
        map((a: any) => a.payload),
        switchMap((user: User) => this.service$.register(user).pipe(
            map(auth => new actions.RegisterSuccessAction(auth)),
            catchError(err => of(new actions.RegisterFailAction(JSON.stringify(err))))
        ))
    );

    @Effect()
    logout$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.LOGOUT),
        tap(_ => this.router.navigate(['/']))
    );

    @Effect()
    loginAndNavigate$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.LOGIN_SUCCESS),
        tap(_ => this.router.navigate(['/project']))
    );

    @Effect()
    registerAndNavigate$: Observable<Action> = this.actions$.pipe(
        ofType(actions.ActionTypes.LOGOUT),
        tap(_ => this.router.navigate(['/project']))
    );
    constructor(
        private actions$: Actions,
        private service$: AuthService,
        private router: Router,
    ) {

    }
}
