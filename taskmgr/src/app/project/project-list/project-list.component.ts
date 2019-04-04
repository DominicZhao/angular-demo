import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  public projects = [
    {
      'name': '企业协作平台',
      'desc': '这是一个企业内部的项目',
      'coverImg': 'assets/img/covers/0.jpg'
    },
    {
      'name': '自动化测试项目',
      'desc': '这是一个企业内部的项目',
      'coverImg': 'assets/img/covers/1.jpg'
    }
  ];

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openNewProjectDialog() {
    const dialogRef = this.dialog.open(NewProjectComponent, { data: { title: '新增项目' } });
    dialogRef.afterClosed().subscribe(result => console.log(result));
  }

  launchInviteDialog() {
    const dialogRef = this.dialog.open(InviteComponent);
  }

  launchUpdateDialog() {
    const dialogRef = this.dialog.open(NewProjectComponent, { data: { title: '编辑项目' } });
    dialogRef.afterClosed().subscribe(result => console.log(result));
  }

  launchConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { title: '删除项目', content: '您确认删除该项目么？' } });
    dialogRef.afterClosed().subscribe(result => console.log(result));
  }

}
