import {SET_USER, IS_AUTHENTICATED, SET_LOADER} from '../action/action.types';

const initialState = {
  user: null,
  loading: false,
  isAuthenticated: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };

    case IS_AUTHENTICATED:
      return {
        ...state,
        isAuthenticated: action.payload,
      };

    case SET_LOADER:
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};
