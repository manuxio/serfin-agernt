import {STATUS_ONLINE, STATUS_OFFLINE} from '../constants/actionTypes';
// import {necessaryDataIsProvidedToCalculateSavings, calculateSavings} from '../utils/fuelSavings';
// import objectAssign from 'object-assign';
import initialState from './initialState';

// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
export default function onlineStatusReducer(state = initialState.onlineStatus, action) {
  // let newState;

  switch (action.type) {
    case STATUS_ONLINE:
      // For this example, just simulating a save by changing date modified.
      // In a real app using Redux, you might use redux-thunk and handle the async call in fuelSavingsActions.js
      console.log('state', state);
      return true;

    case STATUS_OFFLINE:
      console.log('state', state);
      return false;

    default:
      return state;
  }
}
