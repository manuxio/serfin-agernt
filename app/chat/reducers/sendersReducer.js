import moment from 'moment';
// import Map from 'collections/map';
import {BULK_MESSAGES, SEND_MESSAGE, SEND_MESSAGE_SENT} from '../constants/actionTypes';
// import {necessaryDataIsProvidedToCalculateSavings, calculateSavings} from '../utils/fuelSavings';
// import objectAssign from 'object-assign';
import initialState from './initialState';


// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
const makeGroup = (spec) => {
  return {
    name: '',
    lastUpdate: new Date(),
    lastMessage: '',
    lastSender: '',
    isGroup: true,
    messages: [],
    ...spec
  };
}

const makeUser = (spec) => {
  return {
    name: '',
    lastUpdate: new Date(),
    lastMessage: '',
    lastSender: '',
    isGroup: false,
    messages: [],
    ...spec
  };
}

const makeMessage = (spec) => {
  return {
    ...spec
  }
}
export default function sendersReducer(state = initialState.senders, action) {
  // let newState;

  switch (action.type) {
    case SEND_MESSAGE: {
      state = JSON.parse(JSON.stringify(state));
      // console.log('SEND_MESSAGE', action);
      const {
        _id,
        message,
        chat,
        me
      } = action;
      const direction = 'out';
      const date = new Date();
      const sender = `${me.Name} ${me.Surname}`;
      const m = makeMessage({
        _id,
        isToday: moment(date).format('YYYY/MM/DD') === moment().format('YYYY/MM/DD'),
        message,
        date,
        direction,
        sender,
        from: me._id,
        to: chat._id
      });
      const {
        _id: recipientId
      } = chat;
      if (state[recipientId]) {
        state[recipientId].messages.push(m);
        state[recipientId].lastUpdate = m.date;
        state[recipientId].lastMessage = m.message;
        state[recipientId].lastSender = sender;
      }
      // console.log('JSON.stringify(state)', JSON.stringify(state));
      return state;
      // break;
    }
    // case SEND_MESSAGE_SENT: {
    //   console.log('SEND_MESSAGE_SENT', action);
    //   return state;
    //   break;
    // }
    case BULK_MESSAGES:
      // For this example, just simulating a save by changing date modified.
      // In a real app using Redux, you might use redux-thunk and handle the async call in fuelSavingsActions.js
      const {
        messages,
        me
      } = action;
      console.log('messages', messages);
      const {
        _id: myId
      } = me;
      const newState = messages.reduce((prev, msg) => {
        console.log('Considering', msg);
        const {
          _id,
          date,
          message,
          isGroup
        } = msg;
        let key;
        let name;
        if (isGroup) {
          const {
            groupId,
            groupName
          } = msg;
          if (!prev[groupId]) {
            const g = makeGroup({
              _id: groupId,
              name: groupName
            });
            state[groupId] = g;
          }
          const direction = msg.from === myId ? 'out' : 'in';
          let sender;
          if (direction === 'out') {
            sender = `${me.Name} ${me.Surname}`;
          } else {
            sender = `${msg.fromUser.Name} ${msg.fromUser.Surname}`;
          }
          const m = makeMessage({
            _id,
            isToday: moment(date).format('YYYY/MM/DD') === moment().format('YYYY/MM/DD'),
            message,
            date,
            direction,
            sender
          });
          prev[groupId].messages.push(m);
        } else {
          const {
            from,
            to,
            fromUser,
            toUser
          } = msg;
          const direction = msg.from === myId ? 'out' : 'in';
          let mainKey = direction === 'out' ? to : from;
          let name = `${fromUser.Name} ${fromUser.Surname} (${fromUser.username})`;
          let sender = `${fromUser.Name} ${fromUser.Surname}`;
          // console.log('fromUser', fromUser, sender);
          // if (direction === 'out') {
          //   mainKey = to;
          //   name = `${toUser.Name} ${toUser.Surname}`;
          //   sender = `${fromUser.Name} ${fromUser.Surname}`;
          // }
          if (!prev[mainKey]) {
            const g = makeUser({
              _id: mainKey,
              name
            });
            prev[mainKey] = g;
          }
          const m = makeMessage({
            _id,
            from,
            to,
            isToday: moment(date).format('YYYY/MM/DD') === moment().format('YYYY/MM/DD'),
            message,
            date,
            direction,
            sender
          });
          prev[mainKey].messages.push(m);
          prev[mainKey].lastUpdate = m.date;
          prev[mainKey].lastMessage = m.message;
          prev[mainKey].lastSender = sender;
        }
        return prev;
      }, JSON.parse(JSON.stringify(state)));
      console.log('New State', newState);
      return newState;
    default:
      return state;
  }
}
