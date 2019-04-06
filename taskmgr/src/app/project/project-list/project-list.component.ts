import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';

import { slideToRight } from '../../anims/router.anim';
import { listAnimation } from '../../anims/list.anim';

import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [
    slideToRight, listAnimation
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit {

  @HostBinding('@routeAnim') state;

  public projects = [
    {
      'id': 1,
      'name': '企业协作平台',
      'desc': '这是一个企业内部的项目',
      'coverImg': 'assets/img/covers/0.jpg'
    },
    {
      'id': 2,
      'name': '自动化测试项目',
      'desc': '这是一个企业内部的项目',
      'coverImg': 'assets/img/covers/1.jpg'
    }
  ];

  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  openNewProjectDialog() {
    const dialogRef = this.dialog.open(NewProjectComponent, { data: { title: '新增项目' } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.projects = [...this.projects, { 'id': 3, 'name': '一个新项目', 'desc': '这是一个新项目', 'coverImg': 'assets/img/covers/2.jpg' }];
      this.projects = [...this.projects, { 'id': 4, 'name': '又一个新项目', 'desc': '这是又一个新项目', 'coverImg': 'assets/img/covers/3.jpg' }];
      this.cd.markForCheck();
    });
  }

  launchInviteDialog() {
    const dialogRef = this.dialog.open(InviteComponent);
  }

  launchUpdateDialog() {
    const dialogRef = this.dialog.open(NewProjectComponent, { data: { title: '编辑项目' } });
    dialogRef.afterClosed().subscribe(result => console.log(result));
  }

  launchConfirmDialog(project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { title: '删除项目', content: '您确认删除该项目么？' } });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.projects = this.projects.filter(p => p.id !== project.id);
      this.cd.markForCheck();
    });
  }

}
