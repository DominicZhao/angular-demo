import { Action } from '@ngrx/store';
import { Task, TaskList } from '../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum ActionTypes {
    ADD = '[Task] Add',
    ADD_SUCCESS = '[Task] Add Success',
    ADD_FAIL = '[Task] Add Fail',
    UPDATE = '[Task] Update',
    UPDATE_SUCCESS = '[Task] Update Success',
    UPDATE_FAIL = '[Task] Update Fail',
    DELETE = '[Task] Delete',
    DELETE_SUCCESS = '[Task] Delete Success',
    DELETE_FAIL = '[Task] Delete Fail',
    LOAD = '[Task] Load',
    LOAD_SUCCESS = '[Task] Load Success',
    LOAD_FAIL = '[Task] Load Fail',
    MOVE = '[Task] Move',
    MOVE_SUCCESS = '[Task] Move Success',
    MOVE_FAIL = '[Task] Move Fail',
    MOVE_ALL = '[Task] Move All',
    MOVE_ALL_SUCCESS = '[Task] Move All Success',
    MOVE_ALL_FAIL = '[Task] Move All Fail',
    COMPLETE = '[Task] Complete',
    COMPLETE_SUCCESS = '[Task] Complete Success',
    COMPLETE_FAIL = '[Task] Complete Fail',
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 */
export class AddAction implements Action {
    readonly type = ActionTypes.ADD;

    constructor(public payload: Task) { }
}

export class AddSuccessAction implements Action {
    readonly type = ActionTypes.ADD_SUCCESS;

    constructor(public payload: Task) { }
}

export class AddFailAction implements Action {
    readonly type = ActionTypes.ADD_FAIL;

    constructor(public payload: string) { }
}


export class UpdateAction implements Action {
    readonly type = ActionTypes.UPDATE;

    constructor(public payload: Task) { }
}

export class UpdateSuccessAction implements Action {
    readonly type = ActionTypes.UPDATE_SUCCESS;

    constructor(public payload: Task) { }
}

export class UpdateFailAction implements Action {
    readonly type = ActionTypes.UPDATE_FAIL;

    constructor(public payload: string) { }
}


export class DeleteAction implements Action {
    readonly type = ActionTypes.DELETE;

    constructor(public payload: Task) { }
}

export class DeleteSuccessAction implements Action {
    readonly type = ActionTypes.DELETE_SUCCESS;

    constructor(public payload: Task) { }
}

export class DeleteFailAction implements Action {
    readonly type = ActionTypes.DELETE_FAIL;

    constructor(public payload: string) { }
}


export class LoadAction implements Action {
    readonly type = ActionTypes.LOAD;

    constructor(public payload: TaskList[]) { }
}

export class LoadSuccessAction implements Action {
    readonly type = ActionTypes.LOAD_SUCCESS;

    constructor(public payload: Task[]) { }
}

export class LoadFailAction implements Action {
    readonly type = ActionTypes.LOAD_FAIL;

    constructor(public payload: string) { }
}


export class MoveAction implements Action {
    readonly type = ActionTypes.MOVE;

    constructor(public payload: {taskId: string; taskListId: string}) { }
}

export class MoveSuccessAction implements Action {
    readonly type = ActionTypes.MOVE_SUCCESS;

    constructor(public payload: Task) { }
}

export class MoveFailAction implements Action {
    readonly type = ActionTypes.MOVE_FAIL;

    constructor(public payload: string) { }
}


export class MoveAllAction implements Action {
    readonly type = ActionTypes.MOVE_ALL;

    constructor(public payload: {srcListId: string; targetListId: string}) { }
}

export class MoveAllSuccessAction implements Action {
    readonly type = ActionTypes.MOVE_ALL_SUCCESS;

    constructor(public payload: Task[]) { }
}

export class MoveAllFailAction implements Action {
    readonly type = ActionTypes.MOVE_ALL_FAIL;

    constructor(public payload: string) { }
}


export class CompleteAction implements Action {
    readonly type = ActionTypes.COMPLETE;

    constructor(public payload: Task) { }
}

export class CompleteSuccessAction implements Action {
    readonly type = ActionTypes.COMPLETE_SUCCESS;

    constructor(public payload: Task) { }
}

export class CompleteFailAction implements Action {
    readonly type = ActionTypes.COMPLETE_FAIL;

    constructor(public payload: string) { }
}



/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type TaskActions
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
    | MoveAction
    | MoveSuccessAction
    | MoveFailAction
    | MoveAllAction
    | MoveAllSuccessAction
    | MoveAllFailAction
    | CompleteAction
    | CompleteSuccessAction
    | CompleteFailAction;
