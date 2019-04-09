import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms';

@Component({
  selector: 'app-image-list-select',
  templateUrl: './image-list-select.component.html',
  styleUrls: ['./image-list-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageListSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ImageListSelectComponent),
      multi: true
    }
  ]
})
export class ImageListSelectComponent implements ControlValueAccessor {

  private _useSvgIcon = false;

  @Input() title = '选择';
  @Input() cols = 6;
  @Input() rowHeight = '64px';
  @Input() items: string[] = [];
  @Input()
  get useSvgIcon(): boolean {
    return this._useSvgIcon;
  }
  set useSvgIcon(value) {
    this._useSvgIcon = this._coerceBooleanProperty(value);
  }
  @Input() itemWidth = '80px';

  public selected: string;

  constructor() { }

  private _coerceBooleanProperty(value: any): boolean {
    return value != null && `${value}` !== 'false';
  }

  private propagateChange = (_: any) => { };

  writeValue(value: any): void {
    this.selected = value;
    this.propagateChange(this.selected);
  }

  registerOnChange(fn: (_: any) => void): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  validate(c: FormControl): { [key: string]: any } {
    return this.selected ? null : {
      imageListInvalid: {
        valid: false
      }
    };
  }

  onChange(i) {
    this.selected = this.items[i];
  }

}
