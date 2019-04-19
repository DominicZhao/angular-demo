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
import { filter, switchMap, map, take } from 'rxjs/operators';
import { Project } from '../../domain';
import { Subscription, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/project.action';

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

  public projects$: Observable<Project[]>;
  public listAnim$: Observable<number>;

  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private store$: Store<fromRoot.State>
  ) {
    this.store$.dispatch(new actions.LoadAction(null));
    this.projects$ = this.store$.select(fromRoot.getProjects);
    this.listAnim$ = this.projects$.pipe(map(p => p.length));
  }

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  openNewProjectDialog() {
    const selectImg = `/assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`;
    const dialogRef = this.dialog.open(NewProjectComponent, { data: { thumbnails: this.getThumbnails(), img: selectImg } });
    dialogRef.afterClosed()
      .pipe(
        take(1),
        filter(n => n),
        map(val => ({ ...val, coverImg: this.buildImgSrc(val.coverImg) })),
      ).subscribe(project => {
        this.store$.dispatch(new actions.AddAction(project));
        // this.cd.markForCheck();
      });
  }

  launchInviteDialog() {
    const dialogRef = this.dialog.open(InviteComponent, { data: { members: [] } });
    dialogRef.afterClosed()
      .pipe(
        take(1),
      );
  }

  launchUpdateDialog(project: Project) {
    const dialogRef = this.dialog.open(NewProjectComponent, { data: { thumbnails: this.getThumbnails(), project: project } });
    dialogRef.afterClosed()
      .pipe(
        take(1),
        filter(n => n),
        map(val => ({ ...val, id: project.id, coverImg: this.buildImgSrc(val.coverImg) })),
      ).subscribe(prj => {
        this.store$.dispatch(new actions.UpdateAction(prj));
        // this.cd.markForCheck();
      });
  }

  launchConfirmDialog(project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { title: '删除项目', content: '您确认删除该项目么？' } });
    dialogRef.afterClosed()
      .pipe(
        take(1),
        filter(n => n),
      )
      .subscribe(() => {
        this.store$.dispatch(new actions.DeleteAction(project));
        // this.cd.markForCheck();
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
