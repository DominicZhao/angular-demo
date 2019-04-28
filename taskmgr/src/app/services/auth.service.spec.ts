import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../domain';

describe('AuthService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: 'BASE_CONFIG',
          useValue: {
            uri: 'http://localhost:4200'
          }
        },
        AuthService
      ]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('注册后应该返回一个 Observable<Auth>', () => {
    const service: AuthService = TestBed.get(AuthService);
    const mockUser: User = {
      name: 'zhangsan@dev.local',
      password: '123abc',
      email: 'zhangsan@dev.local'
    };
    const mockResponse = {
      id: 'obj123abc',
      name: 'zhangsan@dev.local',
      password: '123abc',
      email: 'zhangsan@dev.local'
    };
    service.register(mockUser).subscribe(auth => {
      expect(auth.token).toBeDefined();
      expect(auth.user).toBeDefined();
      expect(auth.user.id).toEqual(mockResponse.id);
    });
    const req = httpTestingController.expectOne('http://localhost:4200/users?email=zhangsan@dev.local');

    expect(req.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    req.flush(mockResponse);

    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();

    expect(service).toBeTruthy();
  });
});
