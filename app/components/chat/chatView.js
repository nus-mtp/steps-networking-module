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
      marginLeft: "",
    }
    
    
    this.query = "screen and (min-width: " + this.state.minWidth + ")";
    this.widthOfChatTabs = "25%";
  }
  
  showChatTabs(matches) {
    if (matches) {
      return (
        <ChatTabs 
          users={this.state.users} 
          userLength={this.state.users.length} 
          current={this.state.current} 
          width={this.widthOfChatTabs}
        />
      );
    } else {
      return (null);
    }
  }
  
  render() {
    return (
      <div id="chat">
        <MediaQuery query={this.query}>
          {this.showChatTabs.bind(this)}
        </MediaQuery>
        <ChatBody 
          query={this.query}
          marginLeft={this.widthOfChatTabs} 
        />
      </div>
    );
  }
}
