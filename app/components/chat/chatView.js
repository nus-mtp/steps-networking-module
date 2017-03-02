import React, { Component } from 'react';
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
    }
  }
  
  render() {
    return (
      <div id="chat">
        <ChatTabs 
          users={this.state.users} 
          userLength={this.state.users.length} 
          current={this.state.current} 
        />
        <ChatBody />
      </div>
    );
  }
}
