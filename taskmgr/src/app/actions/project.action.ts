import { Action } from '@ngrx/store';
import { Project, User } from '../domain';

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum ActionTypes {
    ADD = '[Project] Add',
    ADD_SUCCESS = '[Project] Add Success',
    ADD_FAIL = '[Project] Add Fail',
    UPDATE = '[Project] Update',
    UPDATE_SUCCESS = '[Project] Update Success',
    UPDATE_FAIL = '[Project] Update Fail',
    DELETE = '[Project] Delete',
    DELETE_SUCCESS = '[Project] Delete Success',
    DELETE_FAIL = '[Project] Delete Fail',
    LOAD = '[Project] Load',
    LOAD_SUCCESS = '[Project] Load Success',
    LOAD_FAIL = '[Project] Load Fail',
    INVITE = '[Project] Invite',
    INVITE_SUCCESS = '[Project] Invite Success',
    INVITE_FAIL = '[Project] Invite Fail',
    SELECT_PROJECT = '[Project] Select Project',
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 */
export class AddAction implements Action {
    readonly type = ActionTypes.ADD;

    constructor(public payload: Project) { }
}

export class AddSuccessAction implements Action {
    readonly type = ActionTypes.ADD_SUCCESS;

    constructor(public payload: Project) { }
}

export class AddFailAction implements Action {
    readonly type = ActionTypes.ADD_FAIL;

    constructor(public payload: string) { }
}


export class UpdateAction implements Action {
    readonly type = ActionTypes.UPDATE;

    constructor(public payload: Project) { }
}

export class UpdateSuccessAction implements Action {
    readonly type = ActionTypes.UPDATE_SUCCESS;

    constructor(public payload: Project) { }
}

export class UpdateFailAction implements Action {
    readonly type = ActionTypes.UPDATE_FAIL;

    constructor(public payload: string) { }
}


export class DeleteAction implements Action {
    readonly type = ActionTypes.DELETE;

    constructor(public payload: Project) { }
}

export class DeleteSuccessAction implements Action {
    readonly type = ActionTypes.DELETE_SUCCESS;

    constructor(public payload: Project) { }
}

export class DeleteFailAction implements Action {
    readonly type = ActionTypes.DELETE_FAIL;

    constructor(public payload: string) { }
}


export class LoadAction implements Action {
    readonly type = ActionTypes.LOAD;

    constructor(public payload: null) { }
}

export class LoadSuccessAction implements Action {
    readonly type = ActionTypes.LOAD_SUCCESS;

    constructor(public payload: Project[]) { }
}

export class LoadFailAction implements Action {
    readonly type = ActionTypes.LOAD_FAIL;

    constructor(public payload: string) { }
}


export class InviteAction implements Action {
    readonly type = ActionTypes.INVITE;

    constructor(public payload: {projectId: string; members: User[]}) { }
}

export class InviteSuccessAction implements Action {
    readonly type = ActionTypes.INVITE_SUCCESS;

    constructor(public payload: Project) { }
}

export class InviteFailAction implements Action {
    readonly type = ActionTypes.INVITE_FAIL;

    constructor(public payload: string) { }
}


export class SelectProjectAction implements Action {
    readonly type = ActionTypes.SELECT_PROJECT;

    constructor(public payload: Project) { }
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type ProjectActions
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
    | InviteAction
    | InviteSuccessAction
    | InviteFailAction
    | SelectProjectAction;
