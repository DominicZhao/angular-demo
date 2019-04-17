
import { NgModule } from '@angular/core';
import { StoreModule, combineReducers, ActionReducer } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';

import * as fromQuote from './quote.reducer';

export interface State {
  quote: fromQuote.State;
}

const initialState: State = {
  quote: fromQuote.initialState
};

const reducers = {
  quote: fromQuote.reducer
};

const productionReducers: ActionReducer<State> = combineReducers(reducers);
const developmentReducers: ActionReducer<State> = combineReducers(storeFreeze(reducers));

export function reducer(state = initialState, action: any): State {
  return productionReducers(state, action);
}

@NgModule({
  imports: [
    StoreModule.forRoot(reducer),
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
