import { Component, OnInit, Input, forwardRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { Address } from 'src/app/domain';
import { Subject, combineLatest, Subscription, Observable, of } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { getAreaByCity, getCitiesByProvince, getProvinces } from '../../utils/area.util';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AreaListComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AreaListComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaListComponent implements OnInit, OnDestroy, ControlValueAccessor {

  public _address: Address = {
    province: '',
    city: '',
    district: '',
    street: ''
  };

  public _province = new Subject();
  public _city = new Subject();
  public _district = new Subject();
  public _street = new Subject();
  public provinces$: Observable<string[]>;
  public cities$: Observable<string[]>;
  public districts$: Observable<any>;
  public sub: Subscription;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    const province$ = this._province.asObservable().pipe(startWith(''));
    const city$ = this._city.asObservable().pipe(startWith(''));
    const districts$ = this._district.asObservable().pipe(startWith(''));
    const street$ = this._street.asObservable().pipe(startWith(''));
    const val$ = combineLatest([province$, city$, districts$, street$], (_p, _c, _d, _s) => {
      return {
        province: _p,
        city: _c,
        district: _d,
        street: _s
      };
    });

    this.sub = val$.subscribe(v => {
      this.propagateChange(v);
    });

    this.provinces$ = of(getProvinces());
    this.cities$ = province$.pipe(map((p: string) => getCitiesByProvince(p)));
    const dis$ = combineLatest(province$, city$, (p: string, c: string) => {
      return getAreaByCity(p, c);
    });

    dis$.subscribe(
      data => {
        this.districts$ = of(data);
      }
    );
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  private propagateChange = (_: any) => { };

  writeValue(value: Address): void {
    console.log(value);
    if (value) {
      this._address = value;
      if (this._address.province) {
        this._province.next(this._address.province);
      }
      if (this._address.city) {
        this._city.next(this._address.city);
      }
      if (this._address.district) {
        this._district.next(this._address.district);
      }
      if (this._address.street) {
        this._street.next(this._address.street);
      }
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }

  validate(c: FormControl): { [key: string]: any } {
    const val = c.value;
    if (!val) {
      return null;
    }
    if (val.province && val.city && val.district && val.street) {
      return null;
    }
    return {
      addressInvalid: true
    };
  }

  onProvinceChange() {
    this._province.next(this._address.province);
  }

  onCityChange() {
    this._city.next(this._address.city);
  }

  onDistrictChange() {
    this._district.next(this._address.district);
  }

  onStreetChange() {
    this._street.next(this._address.street);
  }
}
