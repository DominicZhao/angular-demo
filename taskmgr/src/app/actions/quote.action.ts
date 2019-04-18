export const QUOTE = 'Quote';
export const QUOTE_SUCCESS = 'Quote Success';
export const QUOTE_FAIL = 'Quote Fail';
import { Action } from '@ngrx/store';
import { Quote } from '../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum QuoteActionTypes {
    LOAD = '[Quote] Load',
    LOAD_SUCCESS = '[Quote] Load Success',
    LOAD_FAIL = '[Quote] Load Fail',
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 */
export class LoadAction implements Action {
    readonly type = QuoteActionTypes.LOAD;

    constructor(public payload: null) { }
}

export class LoadSuccessAction implements Action {
    readonly type = QuoteActionTypes.LOAD_SUCCESS;

    constructor(public payload: Quote) { }
}

export class LoadFailAction implements Action {
    readonly type = QuoteActionTypes.LOAD_FAIL;

    constructor(public payload: string) { }
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type QuoteActions
                        = LoadAction
                        | LoadSuccessAction
                        | LoadFailAction;
