import { Component, OnInit, Input, forwardRef, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { map, filter, startWith, debounceTime, distinctUntilChanged, merge } from 'rxjs/operators';
import { Observable, Subscription, combineLatest } from 'rxjs';
import {
  subDays,
  subMonths,
  subYears,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  isBefore,
  parse,
  format,
} from 'date-fns';
import { isValidDate } from '../../utils/date.utils';

export enum AgeUnit {
  Year = 0,
  Month,
  Day
}

export interface Age {
  age: number;
  unit: AgeUnit;
}

@Component({
  selector: 'app-age-input',
  templateUrl: './age-input.component.html',
  styleUrls: ['./age-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AgeInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AgeInputComponent),
      multi: true
    }
  ]
})
export class AgeInputComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @Input() daysTop = 90;
  @Input() daysBottom = 0;
  @Input() monthsTop = 24;
  @Input() monthsBottom = 1;
  @Input() yearsTop = 150;
  @Input() yearsBottom = 1;
  @Input() format = 'YYYY-MM-DD';
  @Input() debounceTime = 300;

  public selecteUnit = AgeUnit.Year;
  public ageUnits = [
    { value: AgeUnit.Year, label: '岁' },
    { value: AgeUnit.Month, label: '月' },
    { value: AgeUnit.Day, label: '天' },
  ];

  public myForm: FormGroup;
  public sub: Subscription;
  public age: FormGroup;
  private propagateChange = (_: any) => { };

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      birthday: ['', this.validateDate],
      age: this.fb.group({
        ageNum: [],
        ageUnit: [AgeUnit.Year]
      }, { validator: this.validateAge('ageNum', 'ageUnit') })
    });

    const birthday = this.myForm.get('birthday');
    const ageNum = this.myForm.get('age').get('ageNum');
    const ageUnit = this.myForm.get('age').get('ageUnit');
    const ageValue = this.myForm.get('age');

    //                  toAge
    //                  /
    // birthday: ------d,from-----------d---------d------d----
    // ageNum:   --an-----------an----------an------------an--
    // ageUnit:  --------au----------au---------au-------au---
    //   a=an+au
    // age:      ---------a------a----a------a---a--------a-a-
    //                     \toDate,from
    //           ----------d------d----d------d---d--------d-d-

    const birthday$ = birthday.valueChanges.pipe(
      map(d => {
        return { date: d, from: 'birthday' };
      }),
      debounceTime(this.debounceTime),
      distinctUntilChanged(),
      filter(_ => birthday.valid)
    );
    const ageNum$ = ageNum.valueChanges.pipe(
      startWith(ageNum.value),
      debounceTime(this.debounceTime),
      distinctUntilChanged(),
    );
    const ageUnit$ = ageUnit.valueChanges.pipe(
      startWith(ageUnit.value),
      debounceTime(this.debounceTime),
      distinctUntilChanged(),
    );

    // const age$ = ageValue.valueChanges.pipe(
    //   combineLatest(ageNum$, ageUnit$, (_age) => {
    //     return this.toDate({ age: _age.ageNum, unit: _age.ageUnit });
    //   }),
    //   map(d => {
    //     return { date: d, from: 'age' };
    //   }),
    //   filter(_ => this.myForm.get('age').valid)
    // );
    // const age$ = Observable.prototype
    //   .pipe(
    //     combineLatest(ageNum$, ageUnit$, (_n, _u) => {
    //       return this.toDate({ age: _n, unit: _u });
    //     }),
    //     map(d => {
    //       return { date: d, from: 'age' };
    //     }),
    //     filter(_ => this.myForm.get('age').valid)
    //   );
    const age$ = combineLatest(ageNum$, ageUnit$, (_n, _u) => {
      return this.toDate({ age: _n, unit: _u });
    }).pipe(
      map(d => {
        return { date: d, from: 'age' };
      }),
      filter(_ => this.myForm.get('age').valid)
    );

    age$.subscribe(
      _ => {
        // console.log(_);
      }
    );

    const merged$ = Observable.prototype
      .pipe(
        merge(age$, birthday$),
        filter(_ => this.myForm.valid)
      );
    this.sub = merged$.subscribe(d => {
      const age = this.toAge(d.date);
      if (d.from === 'birthday') {
        if (age.age !== ageNum.value) {
          ageNum.patchValue(age.age, { emitEvent: false });
        }
        if (age.unit !== ageUnit.value) {
          this.selecteUnit = age.unit;
          ageUnit.patchValue(age.unit, { emitEvent: false });
        }
        this.propagateChange(d.date);
      } else {
        const ageToCopare = this.toAge(birthday.value);
        if (age.age !== ageToCopare.age || age.unit !== ageToCopare.unit) {
          birthday.patchValue(d.date, { emitEvent: false });
          this.propagateChange(d.date);
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  validate(c: FormControl): { [key: string]: any } {
    const val = c.value;
    if (!val) {
      return null;
    }
    if (isValidDate(val)) {
      return null;
    }
    return {
      dateOfBirthInvalid: true
    };
  }

  validateDate(c: FormControl): { [key: string]: any } {
    const val = c.value;
    return isValidDate(val) ? null : {
      birthdayInvalid: true
    };
  }

  validateAge(ageNumKey: string, ageUnitKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      const ageNum = group.controls[ageNumKey];
      const ageUnit = group.controls[ageUnitKey];
      let result = false;
      const ageNumVal = ageNum.value;
      const ageUnitVal = ageUnit.value;
      switch (ageUnitVal) {
        case AgeUnit.Year: {
          result = ageNumVal >= this.yearsBottom && ageNumVal < this.yearsTop;
          break;
        }
        case AgeUnit.Month: {
          result = ageNumVal >= this.monthsBottom && ageNumVal < this.monthsTop;
          break;
        }
        case AgeUnit.Day: {
          result = ageNumVal >= this.daysBottom && ageNumVal < this.daysTop;
          break;
        }
        default:
          break;
      }
      return result ? null : { ageInvalid: true };
    };
  }

  writeValue(value: any): void {
    if (value) {
      const date = format(value, this.format);
      this.myForm.get('birthday').patchValue(date);
      const age = this.toAge(date);
      this.myForm.get('age').get('ageNum').patchValue(age.age);
      this.myForm.get('age').get('ageUnit').patchValue(age.unit);
    }
  }

  registerOnChange(fn: (_: any) => void): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  toAge(dateStr: string): Age {
    const date = parse(dateStr);
    const now = Date.now();
    return isBefore(subDays(now, this.daysTop), date) ?
      { age: differenceInDays(now, date), unit: AgeUnit.Day } :
      isBefore(subMonths(now, this.monthsTop), date) ?
        { age: differenceInMonths(now, date), unit: AgeUnit.Month } :
        {
          age: differenceInYears(now, date),
          unit: AgeUnit.Year
        };
  }

  toDate(age: Age): string {
    const now = Date.now();
    switch (age.unit) {
      case AgeUnit.Year: {
        return format(subYears(now, age.age), this.format);
      }
      case AgeUnit.Month: {
        return format(subMonths(now, age.age), this.format);
      }
      case AgeUnit.Day: {
        return format(subDays(now, age.age), this.format);
      }
      default: {
        return null;
      }
    }
  }

}
