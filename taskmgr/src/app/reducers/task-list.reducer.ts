import * as actions from '../actions/task-list.action';
import * as projectAction from '../actions/project.action';
import { TaskList, Project } from '../domain';
import * as _ from 'lodash';
import { createSelector } from '@ngrx/store';

export interface State {
    ids: string[];
    entities: { [id: string]: TaskList };
    selectedIds: string[];
}

const initialState: State = {
    ids: [],
    entities: {},
    selectedIds: []
};

const addTaskList = (state, action) => {
    const taskList = action.payload;
    if (state.entities[taskList.id]) {
        return state;
    }
    const newids = [...state.ids, taskList.id];
    const newentities = { ...state.entities, [taskList.id]: taskList };
    const newSelectedIds = [...state.selectedIds, taskList.id];
    return { ...state, ids: newids, entities: newentities, selectedIds: newSelectedIds };
};

const delTaskList = (state, action) => {
    const taskList = action.payload;
    const newIds = state.ids.filter(id => id !== taskList.id);
    const newEntities = newIds.reduce((entities, id: string) => ({ ...entities, [id]: state.entities[id] }), {});
    const newSelectedIds = state.selectedIds.filter(id => id !== taskList.id);
    return {
        ids: newIds,
        entities: newEntities,
        selectedIds: newSelectedIds
    };
};

const updateTaskList = (state, action) => {
    const taskList = action.payload;
    const newentities = { ...state.entities, [taskList.id]: taskList };
    return { ...state, entities: newentities };
};

const loadTaskLists = (state, action) => {
    const taskList = action.payload;
    const incomingIds = taskList.map(p => p.id);
    const newIds = _.difference(incomingIds, state.ids);
    const incomingEntities = _.chain(taskList)
        .keyBy('id')
        .mapValues(o => o)
        .value();
    const newEntities = newIds.reduce((entities, id: string) => ({ ...entities, [id]: incomingEntities[id] }), {});
    return {
        ...state,
        ids: [...state.ids, ...newIds],
        entities: { ...state.entities, ...newEntities },
        selectedIds: incomingIds
    };
};

const swapTaskList = (state, action) => {
    const taskList = <TaskList[]>action.payload;
    const updateEntities = _.chain(taskList)
        .keyBy('id')
        .mapValues(o => o)
        .value();
    const newEntities = {...state.entities, ...updateEntities};
    return {
        ...state,
        entities: newEntities
    };
};

const selectProject = (state, action) => {
    const selected = <Project>action.payload;
    const selectedIds = state.ids.filter(id => state.entities[id].projectId === selected.id);
    return {
        ...state,
        selectedIds: selectedIds
    };
};

const delListsByProject = (state, action) => {
    const project = <Project>action.payload;
    const taskListIds = project.taskLists;
    const remainingIds = _.difference(state.ids, taskListIds);
    const remainingEntities = remainingIds.reduce((entities, id) => ({...entities, [id]: state.entities[id]}), {});
    return {
        ids: [...remainingIds],
        entities: remainingEntities,
        selectedIds: []
    };
};

export function reducer(state = initialState, action: actions.TaskListActions | projectAction.ProjectActions): State {
    switch (action.type) {
        case actions.ActionTypes.ADD_SUCCESS: {
            return addTaskList(state, action);
        }
        case actions.ActionTypes.DELETE_SUCCESS: {
            return delTaskList(state, action);
        }
        case actions.ActionTypes.UPDATE_SUCCESS: {
            return updateTaskList(state, action);
        }
        case actions.ActionTypes.LOAD_SUCCESS: {
            return loadTaskLists(state, action);
        }
        case actions.ActionTypes.SWAP_SUCCESS: {
            return swapTaskList(state, action);
        }
        case projectAction.ActionTypes.SELECT_PROJECT: {
            return selectProject(state, action);
        }
        case projectAction.ActionTypes.DELETE_SUCCESS: {
            return delListsByProject(state, action);
        }
        default: {
            return state;
        }
    }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;
export const getSelectedIsds = (state: State) => state.selectedIds;

export const getSelected = createSelector(getSelectedIsds, getEntities, (selectedIds, entities) => {
    return selectedIds.map(id => entities[id]);
});
