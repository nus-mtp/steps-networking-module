import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import ChatBody from './chatBody';
import ChatTabs from './chatTabs';
import Auth from '../../database/auth';

const sockets = io();

export default class ChatView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [ // Store the emails
        /*// 
        'gun@dam.com',
        'gun@dam',
        'Bacon',
        'Turkey',
        'gun@dam',
        //*/
      ],
      current: 0, // current conversation being displayed
      minWidth: '700px',
    };

    this.query = 'screen and (min-width: ' + this.state.minWidth + ')';
    this.widthOfChatTabs = '25%';

    // Get a specific user that wants to be talked to
    const pathname = this.props.location.pathname;
    this.talkToEmail = pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length).trim();
    if (this.talkToEmail===''||this.talkToEmail==='chat') {
      this.talkToEmail = null;
    }
  }
  
  componentWillMount() {
    if(Auth.isUserAuthenticated) {
      let email = Auth.getToken().email;
      email = email.replace(/%40/gi, '@');

      sockets.emit('new user', {userEmail: email}, function(socketId) {
        this.socketId = socketId; // save the socket id
      }.bind(this));

      this.setState({ email });
      this.getAllUsers(email);
    }
  }

  getAllUsers(email) {
    sockets.emit('get all emails involving user', {userEmail: email}, function(err, userList) {
      if (err) {
        // Stuff went wrong
        console.log('Unable to retrieve userList');
      } else {
        if (this.talkToEmail!==null||this.talkToEmail!==undefined) {
          let current = usersList.find(function(user){
            return user===this.talkToEmail;
          });

          if (current===undefined) {
            // If not in the list, add it to the top of the list
            userList.splice(0, 0, this.talkToEmail); 
            current = 0;
          }
        }
        this.setState({ users: userList, current });
      }
    }.bind(this));
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
          sockets={sockets}
        />
      </div>
    );
  }
}

ChatView.propTypes = {
};
