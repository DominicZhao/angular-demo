import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { cold, hot } from 'jasmine-marbles';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { AuthEffects } from './auth.effects';
import { AuthService } from '../services/auth.service';
import { AppRoutingModule } from '../app-routing.module';
import * as authActions from '../actions/auth.action';


describe('Auth Effects', () => {
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppRoutingModule
      ],
      providers: [
        AuthEffects,
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('authService', ['login', 'register'])
        },
        provideMockActions(() => actions),
      ],
    });
  });

  function setup(methodName: string, params: {returnedAuth: any}) {
    const authService = TestBed.get(AuthService);
    if (params) {
      if (methodName === 'login') {
        authService.login.and.returnValues(params.returnedAuth);
      } else {
        authService.register.and.returnValues(params.returnedAuth);
      }
    }
    return {
      authEffects: TestBed.get(AuthEffects)
    };
  }

  it('登录成功发送 LoginSuccessAction', fakeAsync(() => {
    const auth = {
      token: '',
      user: {
        id: '123abc',
        name: 'wang',
        email: 'wang@163.com',
        password: '123456'
      }
    };
    const { authEffects } = setup('login', {returnedAuth: of(auth)});
    const action = new authActions.LoginAction({email: 'wang@163.com', password: '123456'});
    const expectedResult = new authActions.LoginSuccessAction(auth);
    actions = hot('--a-', { a: action });
    const expected = cold('--b', { b: expectedResult });
    expect(authEffects.login$).toBeObservable(expected);
  }));
});

