import {
  Component,
  OnInit,
  OnDestroy,
  HostBinding,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';

import { slideToRight } from '../../anims/router.anim';
import { listAnimation } from '../../anims/list.anim';

import { NewProjectComponent } from '../new-project/new-project.component';
import { InviteComponent } from '../invite/invite.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { ProjectService } from '../../services/project.service';
import { filter, switchMap, map, take } from 'rxjs/operators';
import { Project } from '../../domain';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  animations: [
    slideToRight, listAnimation
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectListComponent implements OnInit, OnDestroy {

  @HostBinding('@routeAnim') state;

  public projects;
  public sub: Subscription;

  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private service$: ProjectService
  ) { }

  ngOnInit() {
    this.sub = this.service$.getProjectList('37489e0c-df34-c261-71c4-ce75357e3035')
      .subscribe(
        data => {
          this.projects = data;
          this.cd.markForCheck();
        });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  openNewProjectDialog() {
    const selectImg = `/assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`;
    const dialogRef = this.dialog.open(NewProjectComponent, { data: { thumbnails: this.getThumbnails(), img: selectImg } });
    dialogRef.afterClosed()
      .pipe(
        take(1),
        filter(n => n),
        map(val => ({ ...val, coverImg: this.buildImgSrc(val.coverImg) })),
        switchMap(v => this.service$.addProject(v))
      ).subscribe(project => {
        this.projects = [...this.projects, project];
        this.cd.markForCheck();
      });
  }

  launchInviteDialog() {
    const dialogRef = this.dialog.open(InviteComponent);
  }

  launchUpdateDialog(project: Project) {
    const dialogRef = this.dialog.open(NewProjectComponent, { data: { thumbnails: this.getThumbnails(), project: project } });
    dialogRef.afterClosed()
      .pipe(
        take(1),
        filter(n => n),
        map(val => ({ ...val, id: project.id, coverImg: this.buildImgSrc(val.coverImg) })),
        switchMap(v => this.service$.updateProject(v))
      ).subscribe(data => {
        const index = this.projects.map(p => p.id).indexOf(project.id);
        this.projects = [...this.projects.slice(0, index), data, ...this.projects.slice(index + 1)];
        this.cd.markForCheck();
      });
  }

  launchConfirmDialog(project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { title: '删除项目', content: '您确认删除该项目么？' } });
    dialogRef.afterClosed()
      .pipe(
        take(1),
        filter(n => n),
        switchMap( d => this.service$.delProject(project))
      )
      .subscribe(prj => {
        this.projects = this.projects.filter(p => p.id !== prj.id);
        this.cd.markForCheck();
      });
  }

  private getThumbnails() {
    return _.range(0, 40)
      .map(i => `/assets/img/covers/${i}_tn.jpg`);
  }

  private buildImgSrc(img: string): string {
    return img.indexOf('_') > -1 ? img.split('_')[0] + '.jpg' : img;
  }

}
