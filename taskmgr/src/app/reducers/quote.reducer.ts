import * as actions from '../actions/quote.action';
import { Quote } from '../domain';

export interface State {
    quote: Quote;
}

const initialState: State = {
    quote: {
        'cn': '我们在人生中会作出许多选择，带着这些选择继续生活，才是人生中最难的一课。《妙笔生花》',
        'en': 'We all make our choices in life. The hard thing to do is live with them.',
        'pic': '/assets/img/quotes/9.jpg'
    }
};

export function reducer(state = initialState, action: actions.QuoteActions): State {
    switch (action.type) {
        case actions.QuoteActionTypes.LOAD_SUCCESS: {
            return {...state, quote: <Quote>action.payload}; // Object.assign({}, state, {quote: action.payload});
        }

        case actions.QuoteActionTypes.LOAD_FAIL:
        default: {
            return state;
        }
    }
}

export const getQuote = (state: State) => state.quote;

