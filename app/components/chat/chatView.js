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
    
    
    /* // Get matching users
    const xhr = new XMLHttpRequest();
    xhr.open('get', `user/get/chat/${this.props.email}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
      } else {
      }
      console.log('Get matched users ' + xhr.response);
    });
    xhr.send();
    // */
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
      } else if (userList!==undefined) {
        //console.log("UserList " + userList);
        let current = this.state.current;
        if (this.talkToEmail!==null&&this.talkToEmail!==undefined) {
          //console.log("TalkToEmail " + this.talkToEmail);
          current = userList.indexOf(this.talkToEmail);
          if (current===-1) { // If not in the list, add it to the top of the list
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

  hasPeopleToTalkTo(){
    if (this.state.users.length===0) {
      return (
        <div style={{textAlign: 'center'}}>
          You have no one to talk to.<br/>
          Please find someone to talk to.
        </div>
      );
    } else {
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
            changeConversation={this.changeConversation.bind(this)}
            email={this.state.email}
            sockets={sockets}
          />
        </div>
      );
    } //end-else
  }

  render() {
    return (
      <div>
        {this.hasPeopleToTalkTo()}
      </div>
    );
  }
}

ChatView.propTypes = {
};
