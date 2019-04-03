import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // {path: '', redirectTo: '/login', pathMatch: 'full'},
  // {path: '', loadChildren: './login/login.module#LoginModule'},
  // {path: 'project', loadChildren: './project/project.module#ProjectModule'},
  {path: '', loadChildren: './project/project.module#ProjectModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
