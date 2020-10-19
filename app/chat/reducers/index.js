import { combineReducers } from 'redux';
import onlineStatus from './onlineStatusReducer';
import messages from './messagesReducer';
import user from './userReducer';
import senders from './sendersReducer';
import appSettings from './appSettingsReducer';
import { connectRouter } from 'connected-react-router';

const rootReducer = history => combineReducers({
  router: connectRouter(history),
  onlineStatus,
  messages,
  user,
  senders,
  appSettings
});

export default rootReducer;
