import { Directive, Input, HostListener, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { DragDropService, DragData } from '../drag-drop.service';
import { take } from 'rxjs/operators';

@Directive({
  selector: '[appDrop][dropTags][dragEnterClass]'
})
export class DropDirective {

  @Input() dragEnterClass: string;
  @Input() dropTags: string[] = [];

  private data$;

  constructor(
    private el: ElementRef,
    private rd: Renderer2,
    private service: DragDropService
  ) {
    this.data$ = this.service.getDragData().pipe(take(1));
  }

  @Output() dropped = new EventEmitter<DragData>();

  @HostListener('dragenter', ['$event'])
  ondragEnter(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(
        dragData => {
          if (this.dropTags.indexOf(dragData.tag) > -1) {
            this.rd.addClass(this.el.nativeElement, this.dragEnterClass);
          }
        }
      );
    }
  }

  @HostListener('dragover', ['$event'])
  ondragOver(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(
        dragData => {
          if (this.dropTags.indexOf(dragData.tag) > -1) {
            this.rd.setProperty(ev, 'dataTransfer.effectAllowed', 'all');
            this.rd.setProperty(ev, 'dataTransfer.dropEffect', 'move');
          } else {
            this.rd.setProperty(ev, 'dataTransfer.effectAllowed', 'none');
            this.rd.setProperty(ev, 'dataTransfer.dropEffect', 'none');
          }
        }
      );
    }
  }

  @HostListener('dragleave', ['$event'])
  ondragLeave(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(
        dragData => {
          if (this.dropTags.indexOf(dragData.tag) > -1) {
            this.rd.removeClass(this.el.nativeElement, this.dragEnterClass);
          }
        }
      );
    }
  }

  @HostListener('drop', ['$event'])
  ondrop(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(
        dragData => {
          if (this.dropTags.indexOf(dragData.tag) > -1) {
            this.rd.removeClass(this.el.nativeElement, this.dragEnterClass);
            this.dropped.emit(dragData);
            this.service.clearDragData();
          }
        }
      );
    }
  }
}
