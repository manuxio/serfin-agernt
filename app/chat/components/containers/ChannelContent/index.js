import React, { useState, useEffect, useRef } from 'react';
import {bindActionCreators} from 'redux';
import { animateScroll } from "react-scroll";
import { DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown, Modal, ModalHeader, ModalBody, CardBody, Button, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import moment from 'moment';
import SimpleBar from "simplebar-react";

import { withRouter } from 'react-router-dom';

//Import Components
import UserHead from "./UserHead";
import ChatInput from "./ChatInput";
import * as chatActions from '../../../actions/chatActions';

import 'remixicon/fonts/remixicon.css';
import useHasChanged from './useHasChanged';

//actions
// import { openUserSidebar,setFullUser } from "../../../redux/actions";

//Import Images
import avatar4 from "../../../assets/images/avatar.jpg";
import avatar1 from "../../../assets/images/avatar.jpg";

//i18n
import { useTranslation } from 'react-i18next';

function UserChat(props) {

    const ref = useRef(null);

    const [modal, setModal] = useState(false);
    const [currentId, setCurrentId] = useState(props.currentChat._id);
    const hasChanged = useHasChanged([
      // hasChanged will be true if either of these values
      // change when compared to each other.
      [currentId,
      props.currentChat._id]
    ]);
    console.log('hasChanged', hasChanged, currentId, props.currentChat._id);
    if (hasChanged) {
      scrolltoBottom();
    }
    useEffect(() => {
    // code to run on component mount
      scrolltoBottom();
    }, [])
    const {
      currentChat
    } = props;
    // const [chatId, setChatId] = useState(currentChat._id);
    // useEffect(() => {
    //   // Update the document title using the browser API
    //   // document.title = `You clicked ${count} times`;
    //   // const prevChatId = usePrevious(currentChat._id);
    //   console.log('Did update?', currentChat._id, chatId, prevChatId);
    // });

    /* intilize t variable for multi language implementation */
    const { t } = useTranslation();

    //demo conversation messages
    //userType must be required
    // const [ allUsers ] = useState(props.recentChatList);
    // const [ chatMessages, setchatMessages ] = useState(props.recentChatList[props.active_user].messages);

    // useEffect(() => {
    //     setchatMessages(props.recentChatList[props.active_user].messages);
    //     ref.current.recalculate();
    //     if (ref.current.el) {
    //         ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
    //     }
    // },[props.active_user, props.recentChatList]);

    const toggle = () => setModal(!modal);

    const addMessage = (text) => {

      if (props.chatActions && props.chatActions.sendMessage) {
        // console.log('Adding Message!');
        props.chatActions.sendMessage(text, props.currentChat, props.me)
      }
      scrolltoBottom();
    }

    function scrolltoBottom(){
        if (ref.current.el) {
            ref.current.getScrollElement().scrollTop = ref.current.getScrollElement().scrollHeight;
        }
    }


    const deleteMessage = (id) => {
        let conversation = chatMessages;

        var filtered = conversation.filter(function (item) {
            return item.id !== id;
        });

        setchatMessages(filtered);
    }

    // const {
    //   currentChat
    // } = props;
    const {
      messages
    } = currentChat;
    console.log('messages', messages);
    // console.log(messages.map((msg) => {
    //   return moment(msg.date).isToday;
    // }))
    return (
        <React.Fragment>
            <div className="user-chat w-100">

                <div className="d-lg-flex">

                    <div className={ props.userSidebar ? "w-70 h-100 verticalFlex" : "w-100 h-100 verticalFlex" }>

                        {/* render user head */}
                        <UserHead chat={currentChat}/>
                          <SimpleBar
                            forceVisible="y" autoHide={false}
                            style={{ maxHeight: "100%", flex: 1 }}
                            ref={ref}
                            className="chat-conversation p-3 p-lg-4"
                            id="messages">
                            <ul className="list-unstyled mb-0">
                            {
                              messages.map((chat, key) => (
                                <li key={key} className={chat.direction === "out" ? "right" : ""}>
                                    <div className={messages[key+1] ? messages[key].from.toString() === messages[key+1].from.toString() ? 'conversation-list' : 'conversation-list' : 'conversation-list'}>
                                            {
                                                //logic for display user name and profile only once, if current and last messaged sent by same receiver
                                                messages[key+1]
                                                ? messages[key].from.toString() === messages[key+1].from.toString()
                                                  ?
                                                // Same sender
                                                    (<div className="chat-avatar">
                                                        <div className="blank-div"></div>
                                                    </div>)
                                                    :
                                                  // Has more, different sender
                                                    (<div className="chat-avatar">
                                                      <div className="chat-user-img align-self-center">
                                                          <div className="avatar-xs">
                                                              <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                                  {messages[key].sender.charAt(0).toUpperCase()}{messages[key].sender.charAt(1).toLowerCase()}
                                                              </span>
                                                          </div>
                                                      </div>
                                                    </div>)
                                                : <div className="chat-avatar">
                                                  <div className="chat-user-img align-self-center">
                                                      <div className="avatar-xs">
                                                          <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                              {messages[key].sender.charAt(0).toUpperCase()}{messages[key].sender.charAt(1).toLowerCase()}
                                                          </span>
                                                      </div>
                                                  </div>
                                                </div>
                                            }


                                        <div className="user-chat-content">
                                            <div className="ctext-wrap">
                                                <div className={messages[key+1] ? messages[key].from.toString() === messages[key+1].from.toString() ? 'ctext-wrap-content' : 'ctext-wrap-content-last' : 'ctext-wrap-content-last'}>
                                                    {
                                                        chat.message &&
                                                            <p className="mb-0">
                                                                {chat.message}
                                                            </p>
                                                    }
                                                    {
                                                        !chat.isTyping && <p className="chat-time mb-0"><i className="ri-time-line align-middle"></i> <span className="align-middle">{chat.isToday ? moment(chat.date).format('HH:mm') : moment(chat.date).format('DD/MM/YY HH:mm')}</span></p>
                                                    }
                                                </div>
                                                {
                                                    !chat.isTyping &&
                                                        <UncontrolledDropdown className="align-self-start">
                                                            <DropdownToggle tag="a">
                                                                <i className="ri-more-2-fill"></i>
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                <DropdownItem>{t('Copy')} <i className="ri-file-copy-line float-right text-muted"></i></DropdownItem>
                                                                <DropdownItem>{t('Save')} <i className="ri-save-line float-right text-muted"></i></DropdownItem>
                                                                <DropdownItem onClick={toggle}>Forward <i className="ri-chat-forward-line float-right text-muted"></i></DropdownItem>
                                                                <DropdownItem onClick={() => deleteMessage(chat.id) }>Delete <i className="ri-delete-bin-line float-right text-muted"></i></DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                }

                                            </div>

                                        </div>
                                    </div>
                                </li>
                              ))
                            }
                            </ul>
                          </SimpleBar>
                        <ChatInput onAddMessage={addMessage} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = (state) => {
    // const { active_user } = state.Chat;
    // const { userSidebar } = state.Layout;
    // return { active_user,userSidebar };
    return {
      me: state.user
    };
};
const mapDispatchToProps = (dispatch) => {
  return {
    chatActions: bindActionCreators(chatActions, dispatch)
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserChat));

