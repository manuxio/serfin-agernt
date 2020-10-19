import {SET_ACTIVE_CHAT} from '../constants/actionTypes';
// import {necessaryDataIsProvidedToCalculateSavings, calculateSavings} from '../utils/fuelSavings';
// import objectAssign from 'object-assign';
import initialState from './initialState';

// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
export default function onlineStatusReducer(state = initialState.appSettings, action) {
  // let newState;

  switch (action.type) {
    case SET_ACTIVE_CHAT:
      const newState = JSON.parse(JSON.stringify(state));
      newState.activeChat = action._id;
      return newState;

    default:
      return state;
  }
}
