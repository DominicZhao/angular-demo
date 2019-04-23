import { Action } from '@ngrx/store';
import { TaskList, User } from '../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum ActionTypes {
    ADD = '[TaskList] Add',
    ADD_SUCCESS = '[TaskList] Add Success',
    ADD_FAIL = '[TaskList] Add Fail',
    UPDATE = '[TaskList] Update',
    UPDATE_SUCCESS = '[TaskList] Update Success',
    UPDATE_FAIL = '[TaskList] Update Fail',
    DELETE = '[TaskList] Delete',
    DELETE_SUCCESS = '[TaskList] Delete Success',
    DELETE_FAIL = '[TaskList] Delete Fail',
    LOAD = '[TaskList] Load',
    LOAD_SUCCESS = '[TaskList] Load Success',
    LOAD_FAIL = '[TaskList] Load Fail',
    SWAP = '[TaskList] Swap',
    SWAP_SUCCESS = '[TaskList] Swap Success',
    SWAP_FAIL = '[TaskList] Swap Fail',
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 */
export class AddAction implements Action {
    readonly type = ActionTypes.ADD;

    constructor(public payload: TaskList) { }
}

export class AddSuccessAction implements Action {
    readonly type = ActionTypes.ADD_SUCCESS;

    constructor(public payload: TaskList) { }
}

export class AddFailAction implements Action {
    readonly type = ActionTypes.ADD_FAIL;

    constructor(public payload: string) { }
}


export class UpdateAction implements Action {
    readonly type = ActionTypes.UPDATE;

    constructor(public payload: TaskList) { }
}

export class UpdateSuccessAction implements Action {
    readonly type = ActionTypes.UPDATE_SUCCESS;

    constructor(public payload: TaskList) { }
}

export class UpdateFailAction implements Action {
    readonly type = ActionTypes.UPDATE_FAIL;

    constructor(public payload: string) { }
}


export class DeleteAction implements Action {
    readonly type = ActionTypes.DELETE;

    constructor(public payload: TaskList) { }
}

export class DeleteSuccessAction implements Action {
    readonly type = ActionTypes.DELETE_SUCCESS;

    constructor(public payload: TaskList) { }
}

export class DeleteFailAction implements Action {
    readonly type = ActionTypes.DELETE_FAIL;

    constructor(public payload: string) { }
}


export class LoadAction implements Action {
    readonly type = ActionTypes.LOAD;

    constructor(public payload: string) { }
}

export class LoadSuccessAction implements Action {
    readonly type = ActionTypes.LOAD_SUCCESS;

    constructor(public payload: TaskList[]) { }
}

export class LoadFailAction implements Action {
    readonly type = ActionTypes.LOAD_FAIL;

    constructor(public payload: string) { }
}


export class SwapAction implements Action {
    readonly type = ActionTypes.SWAP;

    constructor(public payload: {src: TaskList; target: TaskList}) { }
}

export class SwapSuccessAction implements Action {
    readonly type = ActionTypes.SWAP_SUCCESS;

    constructor(public payload: TaskList[]) { }
}

export class SwapFailAction implements Action {
    readonly type = ActionTypes.SWAP_FAIL;

    constructor(public payload: string) { }
}



/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type TaskListActions
    = AddAction
    | AddSuccessAction
    | AddFailAction
    | UpdateAction
    | UpdateSuccessAction
    | UpdateFailAction
    | DeleteAction
    | DeleteSuccessAction
    | DeleteFailAction
    | LoadAction
    | LoadSuccessAction
    | LoadFailAction
    | SwapAction
    | SwapSuccessAction
    | SwapFailAction;
