import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DragData {
  tag: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class DragDropService {

  private _dranData = new BehaviorSubject<DragData>(null);

  constructor() { }

  setDragData(data: DragData) {
    this._dranData.next(data);
  }

  getDragData(): Observable<DragData> {
    return this._dranData.asObservable();
  }

  clearDragData() {
    this._dranData.next(null);
  }
}
