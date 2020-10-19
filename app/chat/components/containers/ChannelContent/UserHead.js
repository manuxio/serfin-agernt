import React, { useState } from 'react';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Media, Button, Input, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

// import { openUserSidebar,setFullUser } from "../../../redux/actions";

function UserHead(props) {
    // const [dropdownOpen, setDropdownOpen] = useState(false);
    // const [dropdownOpen1, setDropdownOpen1] = useState(false);
    //
    // const toggle = () => setDropdownOpen(!dropdownOpen);
    // const toggle1 = () => setDropdownOpen1(!dropdownOpen1);

    const openUserSidebar = (e) => {
        e.preventDefault();
        // props.openUserSidebar();
    }

    function closeUserChat(e){
        e.preventDefault();
        // var userChat = document.getElementsByClassName("user-chat");
        // if(userChat) {
        //     userChat[0].classList.remove("user-chat-show");
        // }
    }

    function deleteMessage()
    {
        //  let allUsers = props.users;
        // let copyallUsers = allUsers;
        // copyallUsers[props.active_user].messages =  [];
        //
        // props.setFullUser(copyallUsers);
    }

    return (
        <React.Fragment>
            <div className="p-3 p-lg-4 border-bottom" style={{ height: '85px' }}>
                            <Row className="align-items-center">
                                <Col sm={4} xs={8}>
                                    <Media className="align-items-center">
                                        <div className="d-block d-lg-none mr-2">
                                            <Link to="#" onClick={(e) => closeUserChat(e)} className="user-chat-remove text-muted font-size-16 p-2">
                                            <i className="ri-arrow-left-s-line"></i></Link>
                                        </div>
                                        {
                                            false ?
                                                <div className="mr-3">
                                                    <img src="" className="rounded-circle avatar-xs" alt="chatvia" />
                                                </div>
                                            :   <div className="chat-user-img align-self-center mr-3">
                                                    <div className="avatar-xs">
                                                        <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                                            {props.chat.name.charAt(0).toUpperCase()}{props.chat.name.charAt(1).toLowerCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                        }

                                    </Media>
                                </Col>
                            </Row>
                        </div>
        </React.Fragment>
    );
}


const mapStateToProps = (state) => {
    // const { users,active_user } = state.Chat;
    // return { ...state.Layout,users,active_user };
    return {};
};

export default connect(mapStateToProps, { })(UserHead);