import {combineReducers} from 'redux';

import auth from './auth';
import images from './images';

export default combineReducers({
  auth,
  images,
});
