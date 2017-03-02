import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import ChatBody from './chatBody';
import ChatTabs from './chatTabs';

export default class ChatView extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      users: [ // Store the emails
        "gun@dam.com",
        "gun@dam",
      ],
      current: 0, // current user being talked to
      minWidth: "700px",      
    }
    
    this.query = "screen and (min-width: " + this.state.minWidth + ")";
    this.widthOfChatTabs = "25%";
  }
  
  checkChatTabs() {
    return (
      <MediaQuery query={this.query}>
        {(matches) => {
          if (matches) {
            return (<ChatTabs 
              users={this.state.users} 
              userLength={this.state.users.length} 
              current={this.state.current} 
              width={this.widthOfChatTabs}
            />);
          } else {
            return (null);
          }
        }}
      </MediaQuery>
    );
  }
  
  render() {
    return (
      <div id="chat">
        {this.checkChatTabs()}
        <ChatBody marginLeft={this.widthOfChatTabs} />
      </div>
    );
  }
}
