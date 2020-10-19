import * as types from '../constants/actionTypes';
import ObjectID from 'bson-objectid';
// example of a thunk using the redux-thunk middleware
export const setActiveChat = (chatId) => {
  return function (dispatch, getState) {
    // thunks allow for pre-processing actions, calling apis, and dispatching multiple actions
    // in this case at this point we could call a service that would persist the fuel savings
    dispatch({
      type: types.SET_ACTIVE_CHAT,
      _id: chatId,
    });
    // dispatch({
    //   type: types.MESSAGES_UPDATED
    // });
    return;
  };
}

