import { NgModule } from '@angular/core';
import { StoreModule, ActionReducerMap, MetaReducer, createSelector, createFeatureSelector } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../../environments/environment';
import { StoreRouterConnectingModule, routerReducer, RouterReducerState, RouterStateSerializer } from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';
import { Auth, Task } from '../domain';

import { CustomSerializer, RouterStateUrl } from './custom-route-serializer';
import * as fromQuote from './quote.reducer';
import * as fromAuth from './auth.reducer';
import * as fromProject from './project.reducer';
import * as fromTaskList from './task-list.reducer';
import * as fromTask from './task.reducer';
import * as fromUser from './user.reducer';

export interface State {
  quote: fromQuote.State;
  auth: Auth;
  router: RouterReducerState<RouterStateUrl>;
  project: fromProject.State;
  taskList: fromTaskList.State;
  tasks: fromTask.State;
  users: fromUser.State;
}

export const reducers: ActionReducerMap<State> = {
  quote: fromQuote.reducer,
  auth: fromAuth.reducer,
  router: routerReducer,
  project: fromProject.reducer,
  taskList: fromTaskList.reducer,
  tasks: fromTask.reducer,
  users: fromUser.reducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [storeFreeze] : [];

export const getQuoteState = (state: State) => state.quote;
export const getAuthState = (state: State) => state.auth;
export const getProjectState = (state: State) => state.project;
export const getTaskListState = (state: State) => state.taskList;
export const getTaskState = (state: State) => state.tasks;
export const getUserState = (state: State) => state.users;
export const selectReducerState = createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');

export const getRouterInfo = createSelector(
  selectReducerState,
  state => state.state
);
export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);
export const getProjects = createSelector(getProjectState, fromProject.getAll);
export const getTaskLists = createSelector(getTaskListState, fromTaskList.getSelected);
export const getTasks = createSelector(getTaskState, fromTask.getTasks);
export const getUsers = createSelector(getUserState, fromUser.getUsers);

export const getUserEntities = createSelector(getUserState, fromUser.getEntities);
export const getTasksWithOwners = createSelector(getTasks, getUserEntities, (tasks, userEntities) => {
  return tasks.map(task => {
    return {
      ...tasks,
      owner: userEntities[task.ownerId],
      participants: task.particpantIds.map(id => userEntities[id])
    };
  });
});

export const getTasksByLists = createSelector(getTaskLists, getTasksWithOwners, (lists, tasks: any) => {
  return lists.map(list => {
    return {
      ...list,
      tasks: tasks.filter(task => task.taskListId === list.id)
    };
  });
});

export const getProjectUsers = (projectId: string) => createSelector(getProjectState, getUserEntities, (state, entities) => {
  return state.entities[projectId].members.map(id => entities[id]);
});

@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    StoreRouterConnectingModule,
  ],
  providers: [{ provide: RouterStateSerializer, useClass: CustomSerializer }],
})
export class AppStoreModule { }
