import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import ChatBody from './chatBody';
import ChatTabs from './chatTabs';
import Auth from '../../database/auth';
import User from '../../database/objectClasses/User.js';

export default class ChatView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [ // Store the emails
        'gun@dam.com',
        'gun@dam',
        'gun@dam.com',
        'gun@dam',
        'gun@dam.com',
        'gun@dam',
        'gun@dam.com',
        'gun@dam',
        'gun@dam.com',
        'gun@dam',
        'gun@dam.com',
        'gun@dam',
        'gun@dam.com',
        'Turkey',
        'Bacon',
        'Turkey',
        'gun@dam',
      ],
      current: 0, // current conversation being displayed
      minWidth: '700px',
    };

    this.query = 'screen and (min-width: ' + this.state.minWidth + ')';
    this.widthOfChatTabs = '25%';
  }
  
  componentWillMount() {
    if(Auth.isUserAuthenticated) {
      let email = Auth.getToken().email;
      email = email.replace('%40', '@');
      
      this.setState({ email });
      console.log(email);
      //*
      User.getUser(email, function callback(err, userObj){
        if(err){
          console.log("No user desu");
        } else {
          let str = "UserObj is " + userObj.name;
          console.log(str);
        }
      });//*/
    }
  }

  changeConversation(index) {
    this.setState({ current: index });
  }

  showChatTabs(matches) {
    let markup = (null);
    if (matches) {
      markup = (
        <div id="chat-sidebar-wrapper">
          <ChatTabs
            width={this.widthOfChatTabs}
            users={this.state.users}
            current={this.state.current}
            changeConversation={this.changeConversation.bind(this)}
            email={this.state.email}
          />
        </div>
      );
    }
    return markup;
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
          email={this.state.email}
        />
      </div>
    );
  }
}

ChatView.propTypes = {
};
