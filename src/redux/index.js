import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {tokens, liquidPosition, loader} from './reducers';

const reducers = combineReducers({
  tokens, liquidPosition, loader
})

export const store = createStore(reducers, applyMiddleware(thunk));
