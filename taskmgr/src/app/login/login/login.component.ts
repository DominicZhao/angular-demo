import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Quote } from 'src/app/domain/quote.model';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../reducers';
import * as actions from '../../actions/quote.action';
import * as authActions from '../../actions/auth.action';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public myForm: FormGroup;
  public quote$: Observable<Quote>;

  constructor(
    private fb: FormBuilder,
    private store$: Store<fromRoot.State>
  ) {
    this.quote$ = this.store$.select(fromRoot.getQuote);
    this.store$.dispatch(new actions.LoadAction(null));
  }

  ngOnInit() {
    // this.FormGroup = new FormGroup({
    //   email: new FormControl('wang@163.com', Validators.compose([Validators.required, Validators.email])),
    //   password: new FormControl('', Validators.required)
    // });
    this.myForm = this.fb.group({
      email: ['lisi@163.com', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });
  }

  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    this.store$.dispatch(new authActions.LoginAction(value));
  }

  /**
   * 自定义验证器
   *
   * @param {FormControl} c
   * @returns {{[key: string]: any}}
   * @memberof LoginComponent
   */
  // validate(c: FormControl): { [key: string]: any } {
  //   if (!c.value) {
  //     return null;
  //   }

  //   const pattern = /^wang+/;
  //   if (pattern.test(c.value)) {
  //     return null;
  //   }

  //   return {
  //     emailNotValid: 'The email must satart width wang'
  //   };
  // }

}
