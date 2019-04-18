
import { NgModule } from '@angular/core';
import { StoreModule, ActionReducerMap, MetaReducer, createSelector } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';

import * as fromQuote from './quote.reducer';

export interface State {
  quote: fromQuote.State;
}

export const reducers: ActionReducerMap<State> = {
  quote: fromQuote.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [storeFreeze] : [];

export const getQuoteState = (state: State) => state.quote;

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
