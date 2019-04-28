import { reducer } from './auth.reducer';
import { async } from '@angular/core/testing';
import * as fromAuth from './auth.reducer';
import * as actions from '../actions/auth.action';

describe('测试 AuthReducer', () => {
  describe('未定义Action', () => {
    it('应该返回一个默认状态', async(() => {
      const action = {} as any;
      const result = reducer(undefined, action);
      expect(result).toEqual(fromAuth.initialState);
    }));
  });

  describe('登录成功', () => {
    it('应该返回一个 Err 为 undefined 而 userId 不为空的 Auth 对象', async(() => {
      const action = {
        type: actions.ActionTypes.LOGIN_SUCCESS,
        payload: {
          token: '',
          user: {
            id: '1',
            email: 'dev@local.dev'
          }
        }
      } as any;
      const result = reducer(undefined, action);
      expect(result.user).toEqual(action.payload.user);
      expect(result.err).toBeUndefined();
    }));
  });
});

