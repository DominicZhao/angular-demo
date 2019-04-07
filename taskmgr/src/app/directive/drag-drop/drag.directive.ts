import { Directive, Input, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { DragDropService } from '../drag-drop.service';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[appDrag][dragTag][dragData][draggedClass]'
})
export class DragDirective {

  private _isDraggable = false;

  @Input('appDrag')
  set isDraggable(val) {
    this._isDraggable = val;
    this.rd.setAttribute(this.el.nativeElement, 'draggable', `${val}`);
  }

  get isDraggable() {
    return this._isDraggable;
  }

  @Input() draggedClass: string;
  @Input() dragTag: string;
  @Input() dragData: any;

  private data$;

  constructor(
    private el: ElementRef,
    private rd: Renderer2,
    private service: DragDropService
  ) {
    this.data$ = this.service.getDragData().pipe(take(1));
  }

  @HostListener('dragstart', ['$event'])
  ondragstart(ev: Event) {
    if (this.el.nativeElement === ev.target) {
      this.rd.addClass(this.el.nativeElement, this.draggedClass);
      this.service.setDragData({tag: this.dragTag, data: this.dragData});
    }
  }

  @HostListener('dragend', ['$event'])
  ondragend(ev: Event) {
    if (this.el.nativeElement === ev.target) {
      this.rd.removeClass(this.el.nativeElement, this.draggedClass);
    }
  }

}
