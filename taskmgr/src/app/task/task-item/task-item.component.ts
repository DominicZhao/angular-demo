import { Component, OnInit, Input, Output, EventEmitter, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { itemAnim } from '../../anims/item.anim';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  animations: [itemAnim],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskItemComponent implements OnInit {

  public widerPrioritry = 'in';

  @Input()
  item;

  @Input()
  avatar;

  constructor() { }

  @Output() taskClick = new EventEmitter<void>();

  ngOnInit() {
    this.avatar = this.item.owner ? this.item.owner.avatar : 'unassigned';
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.widerPrioritry = 'out';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.widerPrioritry = 'in';
  }

  onItemClick() {
    this.taskClick.emit();
  }

  onCheckBoxClick(ev: Event) {
    ev.stopPropagation();
  }

}
