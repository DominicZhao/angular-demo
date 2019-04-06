import { Component, OnInit, Input, Output, EventEmitter, HostBinding, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { cardAnim } from '../../anims/card.anim';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
  animations: [
    cardAnim
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectItemComponent implements OnInit {

  @Input()
  item;

  constructor() { }

  @Output() oninvite = new EventEmitter<void>();
  @Output() onedit = new EventEmitter<void>();
  @Output() ondel = new EventEmitter<void>();
  @HostBinding('@card') cardState = 'out';

  ngOnInit() {
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.cardState = 'hover';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.cardState = 'out';
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
