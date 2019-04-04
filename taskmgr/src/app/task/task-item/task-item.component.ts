import { Component, OnInit, Input } from '@angular/core';
import { isNgTemplate } from '@angular/compiler';
import { MatCardAvatar } from '@angular/material';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {

  @Input()
  item;

  @Input()
  avatar;

  constructor() { }

  ngOnInit() {
    this.avatar = this.item.owner ? this.item.owner.avatar : 'unassigned';
  }

}
