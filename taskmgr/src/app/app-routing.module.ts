import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  // {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: '', loadChildren: './login/login.module#LoginModule', pathMatch: 'full'},
  {path: 'project', loadChildren: './project/project.module#ProjectModule', pathMatch: 'full', canActivate: [AuthGuard]},
  {path: 'tasklists/:id', loadChildren: './task/task.module#TaskModule', pathMatch: 'full', canActivate: [AuthGuard]},
  {path: 'mycal/:view', loadChildren: './my-calendar/my-calendar.module#MyCalendarModule', pathMatch: 'full', canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
