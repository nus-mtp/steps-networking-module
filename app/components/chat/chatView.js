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
        "gun@dam.com",
        "gun@dam",
        "gun@dam.com",
        "gun@dam",
        "gun@dam.com",
        "gun@dam",
        "gun@dam.com",
        "gun@dam",
        "gun@dam.com",
        "gun@dam",
        "gun@dam.com",
        "Turkey",
        "Bacon",
        "Turkey",
        "gun@dam",
      ],
      current: 0, // current conversation being displayed
      minWidth: "700px",
    }
    
    
    this.query = "screen and (min-width: " + this.state.minWidth + ")";
    this.widthOfChatTabs = "25%";
  }
  
  changeConversation(index) {
    this.setState({ current: index });
  }
  
  showChatTabs(matches) {
    if (matches) {
      return (
        <ChatTabs 
          width={this.widthOfChatTabs} 
          users={this.state.users} 
          current={this.state.current} 
          changeConversation={this.changeConversation.bind(this)} 
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
          users={this.state.users} 
          current={this.state.current} 
        />
      </div>
    );
  }
}
