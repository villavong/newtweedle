import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

//Redux Thunk middleware allows you to write action creators
//that return a function instead of an action. The thunk can be
//  used to delay the dispatch of an action, or to dispatch only
//   if a certain condition is met. The inner function receives the
//   store methods dispatch and getState as parameters.

const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
