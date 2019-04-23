import * as actions from '../actions/task.action';
import * as projectAction from '../actions/project.action';
import { Task, Project } from '../domain';
import * as _ from 'lodash';
import { createSelector } from '@ngrx/store';

export interface State {
    ids: string[];
    entities: { [id: string]: Task };
}

const initialState: State = {
    ids: [],
    entities: {},
};

const addTask = (state, action) => {
    const tasks = action.payload;
    if (state.entities[tasks.id]) {
        return state;
    }
    const newids = [...state.ids, tasks.id];
    const newentities = { ...state.entities, [tasks.id]: tasks };
    return { ...state, ids: newids, entities: newentities };
};

const delTask = (state, action) => {
    const tasks = action.payload;
    const newIds = state.ids.filter(id => id !== tasks.id);
    const newEntities = newIds.reduce((entities, id: string) => ({ ...entities, [id]: state.entities[id] }), {});
    return {
        ids: newIds,
        entities: newEntities,
    };
};

const updateTask = (state, action) => {
    const tasks = action.payload;
    const newentities = { ...state.entities, [tasks.id]: tasks };
    return { ...state, entities: newentities };
};

const loadTasks = (state, action) => {
    const tasks = action.payload;
    const incomingIds = tasks.map(p => p.id);
    const newIds = _.difference(incomingIds, state.ids);
    const incomingEntities = _.chain(tasks)
        .keyBy('id')
        .mapValues(o => o)
        .value();
    const newEntities = newIds.reduce((entities, id: string) => ({ ...entities, [id]: incomingEntities[id] }), {});
    return {
        ...state,
        ids: [...state.ids, ...newIds],
        entities: { ...state.entities, ...newEntities },
    };
};

const moveAllTask = (state, action) => {
    const tasks = <Task[]>action.payload;
    const updatedEntities = tasks.reduce((entities, task) => ({...entities, [task.id]: task}), {});
    return {
        ...state,
        entities: {...state.entities, ...updatedEntities}
    };
};

const delByProject = (state, action) => {
    const project = <Project>action.payload;
    const taskListIds = project.taskLists;
    const remainingIds = state.ids.filter(id => taskListIds.indexOf(state.entities[id].taskListId) === -1);
    const remainingEntities = remainingIds.reduce((entities, id) => ({ ...entities, [id]: state.entities[id] }), {});
    return {
        ids: [...remainingIds],
        entities: remainingEntities,
    };
};

export function reducer(state = initialState, action: actions.TaskActions | projectAction.ProjectActions): State {
    switch (action.type) {
        case actions.ActionTypes.ADD_SUCCESS: {
            return addTask(state, action);
        }
        case actions.ActionTypes.DELETE_SUCCESS: {
            return delTask(state, action);
        }
        case actions.ActionTypes.COMPLETE_SUCCESS:
        case actions.ActionTypes.MOVE_SUCCESS:
        case actions.ActionTypes.UPDATE_SUCCESS: {
            return updateTask(state, action);
        }
        case actions.ActionTypes.LOAD_SUCCESS: {
            return loadTasks(state, action);
        }
        case actions.ActionTypes.MOVE_ALL_SUCCESS: {
            return moveAllTask(state, action);
        }
        case projectAction.ActionTypes.DELETE_SUCCESS: {
            return delByProject(state, action);
        }
        default: {
            return state;
        }
    }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;

export const getTasks = createSelector(getIds, getEntities, (ids, entities) => {
    return ids.map(id => entities[id]);
});
