
import { NgModule } from '@angular/core';
import { StoreModule, ActionReducerMap, MetaReducer, createSelector } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';
import { Auth } from '../domain';

import * as fromQuote from './quote.reducer';
import * as fromAuth from './auth.reducer';

export interface State {
  quote: fromQuote.State;
  auth: Auth;
}

export const reducers: ActionReducerMap<State> = {
  quote: fromQuote.reducer,
  auth: fromAuth.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [storeFreeze] : [];

export const getQuoteState = (state: State) => state.quote;
export const getAuthState = (state: State) => state.auth;

export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    StoreRouterConnectingModule.forRoot(),
  ],
})
export class AppStoreModule { }


// import {
//   ActionReducer,
//   ActionReducerMap,
//   createFeatureSelector,
//   createSelector,
//   MetaReducer
// } from '@ngrx/store';
// import { environment } from '../../environments/environment';

// export interface State {

// }

// export const reducers: ActionReducerMap<State> = {

// };


// export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];

// NgModule
// import { reducers, metaReducers } from './reducers';
// import { EffectsModule } from '@ngrx/effects';
// import { AppEffects } from '../app.effects';

// imports: [
//   StoreModule.forRoot(reducers, { metaReducers }),
//   EffectsModule.forRoot([AppEffects]),
// ]
