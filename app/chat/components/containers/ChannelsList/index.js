import React from 'react';
import { connect } from "react-redux";

import { TabContent, TabPane } from "reactstrap";

//Import Components
import Chats from "./Tabs/Chats";

function ChatLeftSidebar(props) {

    const activeTab = props.activeTab;
    console.log('CHATS', props.chats);
    return (
        <React.Fragment>
            <div className="chat-leftsidebar">

                <TabContent activeTab="chat">
                    {/* Start chats tab-pane  */}
                    <TabPane tabId="chat" id="pills-chat">
                        {/* chats content */}
                        <Chats recentChatList={Array.from(Object.keys(props.chats)).map(key => props.chats[key])}/>
                    </TabPane>
                </TabContent>
                {/* end tab content */}

                </div>
        </React.Fragment>
    );
}

const mapStatetoProps = state => {
    return {
      ...state.Layout,
      chats: state.senders
    };
};

export default connect(mapStatetoProps, null)(ChatLeftSidebar);