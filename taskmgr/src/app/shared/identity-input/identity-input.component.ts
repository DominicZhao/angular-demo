import { Component, OnInit, Input, forwardRef, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import { IdentityType, Identity } from '../../domain';
import { Subject, Observable, Subscription, combineLatest } from 'rxjs';
import { extractInfo, isValidAddr } from '../../utils/identity.util';
import { isValidDate } from '../../utils/date.utils';

@Component({
  selector: 'app-identity-input',
  templateUrl: './identity-input.component.html',
  styleUrls: ['./identity-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdentityInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IdentityInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IdentityInputComponent implements OnInit, OnDestroy, ControlValueAccessor {

  public identityType = [
    {
      value: IdentityType.IdCard,
      label: '身份证'
    },
    {
      value: IdentityType.Insurance,
      label: '医保'
    },
    {
      value: IdentityType.Military,
      label: '军官证'
    },
    {
      value: IdentityType.Other,
      label: '其他'
    },
    {
      value: IdentityType.Passport,
      label: '护照'
    }
  ];

  public identity: Identity = { identityNo: null, identityType: null };
  private _idType = new Subject<IdentityType>();
  private _idNo = new Subject<string>();
  private sub: Subscription;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    // const val$ = Observable.prototype.pipe(
    //   combineLatest(this.idNo, this.idType, (_id, _type) => {
    //     return {
    //       identityType: _type,
    //       identityNo: _id
    //     };
    //   })
    // );
    const val$ = combineLatest(this.idNo, this.idType);
    this.sub = val$.subscribe(([idNo, idType]) => {
      this.propagateChange({ identityType: idType, identityNo: idNo });
    });

  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  private propagateChange = (_: any) => { };

  writeValue(value: any): void {
    if (value) {
      this.identity = value;
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
    switch (val.identityType) {
      case IdentityType.IdCard: {
        return this.validateIdCard(c);
      }
      case IdentityType.Military: {
        return this.validateMilitary(c);
      }
      case IdentityType.Passport: {
        return this.validatePassport(c);
      }
      default: {
        return null;
      }
    }
  }

  validateIdCard(c: FormControl): { [key: string]: any } {
    const val = c.value.identityNo;
    if (val.length !== 18) {
      return { idInvalid: true };
    }
    const pattern = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}[x0-9]$/;
    let result = false;
    if (pattern.test(val)) {
      const info = extractInfo(val);
      if (isValidAddr(info.addrCode) && isValidDate(info.dateOfBirth)) {
        result = true;
      }
    }
    return result ? null : { idInvalid: true };
  }

  validateMilitary(c: FormControl): { [key: string]: any } {
    const val = c.value.identityNo;
    const pattern = /[\u4e00-\u9fa5](字第)(\d{4,8})(号?)$/;
    return pattern.test(val) ? null : { idInvalid: true };
  }

  validatePassport(c: FormControl): { [key: string]: any } {
    const val = c.value.identityNo;
    if (val.length !== 9) {
      return { idInvalid: true };
    }
    const pattern = /^[GgEe]\d{8}$/;
    return pattern.test(val) ? null : { idInvalid: true };
  }

  onIdTypeChange(idType: IdentityType) {
    this._idType.next(idType);
  }

  onIdNoChange(idNo: string) {
    this._idNo.next(idNo);
  }

  get idType(): Observable<IdentityType> {
    return this._idType.asObservable();
  }

  get idNo(): Observable<string> {
    return this._idNo.asObservable();
  }

}
