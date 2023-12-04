import {combineReducers, createStore} from 'redux';
import {Reducer} from '../reducer/Reducer';

const reducer = combineReducers({Reducer});
export const myStore = createStore(reducer);
