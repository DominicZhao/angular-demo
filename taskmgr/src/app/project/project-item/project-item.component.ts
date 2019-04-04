import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss']
})
export class ProjectItemComponent implements OnInit {

  @Input()
  item;

  constructor() { }

  @Output() oninvite = new EventEmitter<void>();
  @Output() onedit = new EventEmitter<void>();
  @Output() ondel = new EventEmitter<void>();

  ngOnInit() {
  }

  onInviteClick() {
    this.oninvite.emit();
  }

  onEditClick() {
    this.onedit.emit();
  }

  onDelClick() {
    this.ondel.emit();
  }
}
