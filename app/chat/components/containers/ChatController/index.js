import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { ipcRenderer } from 'electron';
import ShimController from '../ShimController';
import * as chatActions from '../../../actions/chatActions';
import * as userActions from '../../../actions/userActions';
// import SideMenu from '../SideMenu';
// import ChannelContent from '../ChannelContent';
import ChannelsList from '../ChannelsList';
import UserChat from '../ChannelContent';
// import FuelSavingsForm from '../FuelSavingsForm';

export class ChatController extends React.Component {
  componentDidMount() {
    console.log('Actions', chatActions);
    console.log('Listening to ipcEvents');
    ipcRenderer.on('disconnect', (event, arg) => {
      console.log('Got disconnect');
      this.props.chatActions.setOffline();
    });
    ipcRenderer.on('connect', (event, arg) => {
      console.log('Got connect');
      this.props.chatActions.setOnline();
    });
    ipcRenderer.on('chat:message', (event, arg) => {
      console.log('Chat data in browser react compomnent', event, arg);
      console.log(this.props.gotMessage(arg));
    });
    ipcRenderer.send('user:me');
    ipcRenderer.on('user:me:reply', (event, retval) => {
      console.log('Chat data in browser react compomnent', retval);
      this.props.userActions.setUser(retval);
    });
    ipcRenderer.send('socket:proxy', {
      cmd: 'bulk:chat:messages',
      arg: {
        lastMessageId: null
      },
      callback: true
    });
    ipcRenderer.on('bulk:chat:messages:reply', (event, arg) => {
      // console.log('Got bulk messages reply', event, arg);
      const {
        error,
        result
      } = arg;
      if (!error) {
        console.log('Got', 'bulk:chat:messages:reply', result);
        this.props.chatActions.bulkLoadMessages(result);
      }
      // console.log(this.props.gotMessage(arg));
    });
  }
  render() {
    return (
      <ShimController>
        <div className="layout-wrapper d-lg-flex">
          <ChannelsList />
          {
            this.props.appSettings.activeChat
            ? <UserChat currentChat={this.props.senders[this.props.appSettings.activeChat]} recentChatList={this.props.users} />
            : null
          }
        </div>
      </ShimController>
    );
  }
}

ChatController.propTypes = {
  chatActions: PropTypes.object.isRequired,
  userActions: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  console.log('Full State', state);
  return {
    messages: state.messages,
    user: state.user,
    senders: state.senders,
    appSettings: state.appSettings
  };
}

function mapDispatchToProps(dispatch) {
  return {
    chatActions: bindActionCreators(chatActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatController);
