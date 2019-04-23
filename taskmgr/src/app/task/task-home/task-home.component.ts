import { Component, OnInit, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog } from '@angular/material';

import { slideToRight } from '../../anims/router.anim';

import { NewTaskComponent } from '../new-task/new-task.component';
import { CopyTaskComponent } from '../copy-task/copy-task.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { NewTaskListComponent } from '../new-task-list/new-task-list.component';
import { Observable } from 'rxjs';
import { pluck, take, filter } from 'rxjs/operators';
import { TaskList } from '../../domain';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/task-list.action';


@Component({
  selector: 'app-task-home',
  templateUrl: './task-home.component.html',
  styleUrls: ['./task-home.component.scss'],
  animations: [
    slideToRight
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskHomeComponent implements OnInit {

  @HostBinding('@routeAnim') state;
  // public projectId$: Observable<string>;
  public projectId: string;
  public lists$: Observable<TaskList[]>;

  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private store: Store<fromRoot.State>,
    private activated: ActivatedRoute,
  ) {
    this.activated.paramMap.subscribe((params: ParamMap) => {
      this.projectId = params.get('id');
    });
    // this.projectId$ = this.activated.paramMap.pipe(
    //   pluck('id')
    // );
    this.store.dispatch(new actions.LoadAction(this.projectId));
    this.lists$ = this.store.select(fromRoot.getTaskLists);
  }

  ngOnInit() {
  }

  launchNewTaskDialog() {
    const dialogRef = this.dialog.open(NewTaskComponent, { data: { title: '新建任务' } });
  }

  launchCopyTaskDialog() {
    // this.dialog.open(CopyTaskComponent, { data: { lists: this.lists } });
  }

  launchUpdateTaskDialog(item) {
    const dialogRef = this.dialog.open(NewTaskComponent, { data: { title: '修改任务', task: item } });
  }

  launchConfirmDialog(list: TaskList) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { title: '删除任务', content: '您确认删除该任务么？' } });
    dialogRef.afterClosed()
      .pipe(
        take(1),
        filter(n => n)
      )
      .subscribe(result => this.store.dispatch(new actions.DeleteAction(list)));
    this.cd.markForCheck();
  }

  launchEditListDialog(list: TaskList) {
    const dialogRef = this.dialog.open(NewTaskListComponent, { data: { title: '更改列表名称', taskList: list } });
    dialogRef.afterClosed()
      .pipe(
        take(1),
      )
      .subscribe(result => this.store.dispatch(new actions.UpdateAction({ ...result, id: list.id })));
    this.cd.markForCheck();
  }

  launchNewListDialog(ev: Event) {
    const dialogRef = this.dialog.open(NewTaskListComponent, { data: { title: '新建列表' } });
    dialogRef.afterClosed()
      .pipe(
        take(1)
      )
      .subscribe(result => this.store.dispatch(new actions.AddAction(result)));
    this.cd.markForCheck();
  }

  handleMove(srcData, list) {
    switch (srcData.tag) {
      case 'task-item':
        console.log('handling item');
        break;
      case 'task-list':
        console.log('handling list');
        const srcList = srcData.data;
        const tempOrder = srcList.order;
        srcList.order = list.order;
        list.order = tempOrder;
        break;
      default:
        break;
    }
  }

  handleQuickTask(desc: string) {
    console.log(desc);
  }

}
