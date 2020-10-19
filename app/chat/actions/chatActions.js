import * as types from '../constants/actionTypes';
import ObjectID from 'bson-objectid';
import { ipcRenderer } from 'electron';
// example of a thunk using the redux-thunk middleware
export const sendMessage = (message, chat, me) => {
  return function (dispatch/*, getState*/) {
    // thunks allow for pre-processing actions, calling apis, and dispatching multiple actions
    // in this case at this point we could call a service that would persist the fuel savings
    const _id = ObjectID();
    // console.log('New Id', _id.toString());
    // console.log('In ACTION', message, chat);

    ipcRenderer.send('socket:proxy', {
      cmd: 'chat:sendmessage',
      arg: {
        message,
        channel: chat,
        _id: _id.toString()
      },
      callback: true
    });
    ipcRenderer.once('chat:sendmessage:reply', (event, arg) => {
      // console.log('Got bulk messages reply', event, arg);
      const {
        error,
        result
      } = arg;
      if (!error) {
        // console.log('Got', 'chat:sendmessage:reply', result);
        dispatch({
          type: types.SEND_MESSAGE_SENT,
          oldId: _id.toString(),
          newId: result._id
        });
      }
      // console.log(this.props.gotMessage(arg));
    });
    dispatch({
      type: types.SEND_MESSAGE,
      _id: _id.toString(),
      message,
      chat,
      me
      // to
    });
    // dispatch({
    //   type: types.MESSAGES_UPDATED
    // });
    return;
  };
}

export const bulkLoadMessages = (messages) => {
  return function (dispatch, getState) {
    // thunks allow for pre-processing actions, calling apis, and dispatching multiple actions
    // in this case at this point we could call a service that would persist the fuel savings
    // console.log('dispatch', dispatch);
    // console.log(', getState', getState);
    const state = getState();
    return dispatch({
      type: types.BULK_MESSAGES,
      messages,
      me: state.user
    });
  };
}

export const setOnline = () => {
  return function (dispatch) {
    // thunks allow for pre-processing actions, calling apis, and dispatching multiple actions
    // in this case at this point we could call a service that would persist the fuel savings
    return dispatch({
      type: types.STATUS_ONLINE
    });
  };
}

export const setOffline = () => {
  return function (dispatch) {
    // thunks allow for pre-processing actions, calling apis, and dispatching multiple actions
    // in this case at this point we could call a service that would persist the fuel savings
    return dispatch({
      type: types.STATUS_OFFLINE
    });
  };
}

