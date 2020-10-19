// import Map from 'collections/map';
import {SEND_MESSAGE, BULK_MESSAGES} from '../constants/actionTypes';
// import {necessaryDataIsProvidedToCalculateSavings, calculateSavings} from '../utils/fuelSavings';
// import objectAssign from 'object-assign';
import initialState from './initialState';

// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
export default function messagesReducer(state = initialState.messages, action) {
  // let newState;

  switch (action.type) {
    case SEND_MESSAGE:
      // For this example, just simulating a save by changing date modified.
      // In a real app using Redux, you might use redux-thunk and handle the async call in fuelSavingsActions.js

      return state;
    // case BULK_MESSAGES: {
    //   console.log('Reducer action', action, state);
    //   const {
    //     messages
    //   } = action;
    //   messages.forEach((msg) => {
    //     state.set(msg._id, msg);
    //   })
    //   const newState = new Map(state);
    //   newState[Symbol.iterator] = function* () {
    //       yield* [...this.entries()].sort((a, b) => {
    //         if (!a.date || !b.date) return 0;
    //         if (a.date < b.date) return -1;
    //         if (a.date.toString() === b.date.toString()) return 0;
    //         return 1;
    //       });
    //   };
    //   return newState;
    // }
    default:
      return state;
  }
}
