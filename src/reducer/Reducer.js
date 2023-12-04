import {CHANGE_THEME} from '../action/ActionTypes';

export const Reducer = (state = false, action) => {
  switch (action.type) {
    case CHANGE_THEME:
      return action.payload;
    default:
      return state;
  }
};
