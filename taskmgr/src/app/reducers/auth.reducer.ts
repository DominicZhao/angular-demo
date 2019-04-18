import * as actions from '../actions/auth.action';
import { Auth } from '../domain';

const initialState: Auth = {};

export function reducer(state = initialState, action: actions.LoginActions ): Auth {
    switch (action.type) {
        case actions.ActionTypes.REGISTER_SUCCESS:
        case actions.ActionTypes.LOGIN_SUCCESS: {
            return {...<Auth>action.payload};
        }
        case actions.ActionTypes.LOGIN_FAIL:
        case actions.ActionTypes.REGISTER_FAIL: {
            return initialState;
        }
        default: {
            return state;
        }
    }
}
