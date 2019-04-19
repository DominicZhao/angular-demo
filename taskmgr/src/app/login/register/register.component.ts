import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { extractInfo, isValidAddr, getAddrByCode } from 'src/app/utils/identity.util';
import { isValidDate } from '../../utils/date.utils';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../reducers';
import * as authActions from '../../actions/auth.action';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  items: string[];
  public registerForm: FormGroup;

  private readonly avatarName = 'avatars';

  private sub: Subscription;

  constructor(
    private fb: FormBuilder,
    private store$: Store<fromRoot.State>
  ) { }

  ngOnInit() {
    const img = `${this.avatarName}:svg-${Math.floor(Math.random() * 16).toFixed(0)}`;
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    this.items = nums.map(d => `avatars:svg-${d}`);
    this.registerForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      name: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      avatar: [img, Validators.required],
      dateOfBirth: ['1990-01-01'],
      identity: [],
      address: []
    });
    const id$ = this.registerForm.get('identity').valueChanges
      .pipe(
        debounceTime(300),
        filter(_ => this.registerForm.get('identity').valid)
      );
    this.sub = id$.subscribe(id => {
      const info = extractInfo(id.identityNo);
      if (isValidAddr(info.addrCode)) {
        const addr = getAddrByCode(info.addrCode);
        console.log(addr);
        this.registerForm.get('address').patchValue(addr);
      }
      if (isValidDate(info.dateOfBirth)) {
        this.registerForm.get('dateOfBirth').patchValue(info.dateOfBirth);
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    this.store$.dispatch(new authActions.RegisterAction(value));
  }

}
