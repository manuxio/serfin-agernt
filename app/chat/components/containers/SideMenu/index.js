import React from 'react';
import { connect } from "react-redux";

import { TabContent, TabPane } from "reactstrap";
// import './index.scss';
//Import Components
import Profile from "./Tabs/Profile";
// import Chats from "./Tabs/Chats";
// import Groups from "./Tabs/Groups";
// import Contacts from "./Tabs/Contacts";
// import Settings from "./Tabs/Settings";

function ChatLeftSidebar(props) {

    const activeTab = props.activeTab;

    return (
        <React.Fragment>
            <div className="chat-leftsidebar mr-lg-1">

                <TabContent activeTab={activeTab}>
                    {/* Start Profile tab-pane */}
                    <TabPane tabId="profile" id="pills-user">
                        {/* profile content  */}
                        <Profile />
                    </TabPane>
                   {/* End Profile tab-pane  */}
                </TabContent>
                {/* end tab content */}

                </div>
        </React.Fragment>
    );
}

const mapStatetoProps = state => {
    return {
      ...state.Layout
    };
};

export default connect(mapStatetoProps, null)(ChatLeftSidebar);