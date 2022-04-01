import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {tokens, liquidPosition} from './reducers';

const reducers = combineReducers({
  tokens,liquidPosition
})

export const store = createStore(reducers, applyMiddleware(thunk));
