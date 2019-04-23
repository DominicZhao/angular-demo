import { Action } from '@ngrx/store';
import { User, Project } from '../domain';

export interface UserProject {
    user: User;
    projectId: string;
}

/**
 * For each action type in an action group, make a simple
 * enum object for all of this group's action types.
 */
export enum ActionTypes {
    ADD = '[User] Add User Project',
    ADD_SUCCESS = '[User] Add User Project Success',
    ADD_FAIL = '[User] Add User Project Fail',
    UPDATE = '[User] Update User Project',
    UPDATE_SUCCESS = '[User] Update User Project Success',
    UPDATE_FAIL = '[User] Update User Project Fail',
    DELETE = '[User] Delete User Project',
    DELETE_SUCCESS = '[User] Delete User Project Success',
    DELETE_FAIL = '[User] Delete User Project Fail',
    LOAD = '[User] Load Users By Projects',
    LOAD_SUCCESS = '[User] Load Users By Projects Success',
    LOAD_FAIL = '[User] Load Users By Projects Fail',
    SEARCH = '[User] Search',
    SEARCH_SUCCESS = '[User] Search Success',
    SEARCH_FAIL = '[User] Search Fail',
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 */
export class AddAction implements Action {
    readonly type = ActionTypes.ADD;

    constructor(public payload: UserProject) { }
}

export class AddSuccessAction implements Action {
    readonly type = ActionTypes.ADD_SUCCESS;

    constructor(public payload: User) { }
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

    constructor(public payload: User[]) { }
}

export class UpdateFailAction implements Action {
    readonly type = ActionTypes.UPDATE_FAIL;

    constructor(public payload: string) { }
}


export class DeleteAction implements Action {
    readonly type = ActionTypes.DELETE;

    constructor(public payload: UserProject) { }
}

export class DeleteSuccessAction implements Action {
    readonly type = ActionTypes.DELETE_SUCCESS;

    constructor(public payload: User) { }
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

    constructor(public payload: User[]) { }
}

export class LoadFailAction implements Action {
    readonly type = ActionTypes.LOAD_FAIL;

    constructor(public payload: string) { }
}


export class SearchAction implements Action {
    readonly type = ActionTypes.SEARCH;

    constructor(public payload: string) { }
}

export class SearchSuccessAction implements Action {
    readonly type = ActionTypes.SEARCH_SUCCESS;

    constructor(public payload: User[]) { }
}

export class SearchFailAction implements Action {
    readonly type = ActionTypes.SEARCH_FAIL;

    constructor(public payload: string) { }
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type UserActions
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
    | SearchAction
    | SearchSuccessAction
    | SearchFailAction;
