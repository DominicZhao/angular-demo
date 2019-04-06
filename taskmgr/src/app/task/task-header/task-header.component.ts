import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-task-header',
  templateUrl: './task-header.component.html',
  styleUrls: ['./task-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskHeaderComponent implements OnInit {

  @Input() header = '';

  constructor() { }

  @Output() newTask = new EventEmitter<void>();
  @Output() moveAll = new EventEmitter<void>();
  @Output() ondel = new EventEmitter<void>();
  @Output() oneditList = new EventEmitter<void>();

  ngOnInit() {
  }

  onNewTask() {
    this.newTask.emit();
  }

  onMoveAll() {
    this.moveAll.emit();
  }

  onDelTask() {
    this.ondel.emit();
  }

  onEditListClick() {
    this.oneditList.emit();
  }

}
