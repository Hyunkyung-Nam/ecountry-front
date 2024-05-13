import { combineReducers } from 'redux';
import {
  setting1Reducer,
  setting2Reducer,
  setting3Reducer,
  setting4Reducer,
  setting5Reducer,
  setting6Reducer,
  setting7Reducer,
  setting8Reducer,
  setting9Reducer,
} from './settingReducer';

const rootReducer = combineReducers({
  setting1: setting1Reducer,
  setting2: setting2Reducer,
  setting3: setting3Reducer,
  setting4: setting4Reducer,
  setting5: setting5Reducer,
  setting6: setting6Reducer,
  setting7: setting7Reducer,
  setting8: setting8Reducer,
  setting9: setting9Reducer,
});

export default rootReducer;
