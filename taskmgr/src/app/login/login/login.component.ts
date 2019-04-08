import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public myForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    // this.FormGroup = new FormGroup({
    //   email: new FormControl('wang@163.com', Validators.compose([Validators.required, Validators.email])),
    //   password: new FormControl('', Validators.required)
    // });
    this.myForm = this.fb.group({
      email: ['wang@163.com', Validators.compose([Validators.required, Validators.email, this.validate])],
      password: ['', Validators.required]
    });
  }

  onSubmit({ value, valid }, ev: Event) {
    ev.preventDefault();
    console.log(JSON.stringify(value));
    console.log(valid);
  }

  /**
   * 自定义验证器
   *
   * @param {FormControl} c
   * @returns {{[key: string]: any}}
   * @memberof LoginComponent
   */
  validate(c: FormControl): {[key: string]: any} {
    if (!c.value) {
      return null;
    }

    const pattern = /^wang+/;
    if (pattern.test(c.value)) {
      return null;
    }

    return {
      emailNotValid: 'The email must satart width wang'
    };
  }

}
