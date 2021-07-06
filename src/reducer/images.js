import {SET_IMAGES} from '../action/action.types';

const initialState = {
  images: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_IMAGES:
      return {
        images: action.payload || [],
      };

    default:
      return state;
  }
};
