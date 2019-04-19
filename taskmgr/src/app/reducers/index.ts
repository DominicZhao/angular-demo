
import { NgModule } from '@angular/core';
import { StoreModule, ActionReducerMap, MetaReducer, createSelector, createFeatureSelector } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { StoreRouterConnectingModule, routerReducer, RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';
import { Auth } from '../domain';

import * as fromQuote from './quote.reducer';
import * as fromAuth from './auth.reducer';
import { CustomSerializer, RouterStateUrl } from './custom-route-serializer';

export interface State {
  quote: fromQuote.State;
  auth: Auth;
  router: RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
  quote: fromQuote.reducer,
  auth: fromAuth.reducer,
  router: routerReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [storeFreeze] : [];

export const getQuoteState = (state: State) => state.quote;
export const getAuthState = (state: State) => state.auth;
export const selectReducerState = createFeatureSelector<
  RouterReducerState<RouterStateUrl>
>('router');

export const getRouterInfo = createSelector(
  selectReducerState,
  state => state.state
);
export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    StoreRouterConnectingModule,
  ],
  providers: [{ provide: RouterStateSerializer, useClass: CustomSerializer }],
})
export class AppStoreModule { }
