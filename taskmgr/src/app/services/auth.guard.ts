import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../reducers';
import { getAuthState } from '../reducers';
import { map, defaultIfEmpty } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private store$: Store<fromRoot.State>,
    private router: Router,
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.store$.select(getAuthState).pipe(
      map(auth => {
        const result = auth.token !== null && auth.token !== undefined;
        if (!result) {
          this.router.navigate(['/']);
        }
        return result;
      }),
      defaultIfEmpty(false)
    );
  }
}
