/*
   eslint-disable array-callback-return,
   jsx-a11y/no-static-element-interactions,
   react/jsx-no-bind,
   class-methods-use-this,
   consistent-return,
   no-param-reassign,
   react/forbid-prop-types,
*/

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
      users: [],
      names: [],
      current: 0, // current conversation being displayed
      minWidth: '700px',
    };

    this.query = 'screen and (min-width: ' + this.state.minWidth + ')';
    this.widthOfChatTabs = '25%';

    // Get a specific user that wants to be talked to
    const pathname = this.props.location.pathname;
    this.talkToEmail = pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length).trim();
    if (this.talkToEmail===''||this.talkToEmail==='chat') {
      this.talkToEmail = '';
    }

    //*// validate talkToEmail
    if (this.talkToEmail!=='') {
      const xhr = new XMLHttpRequest();
      xhr.open('get', `user/get/profile/${this.talkToEmail}`);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.responseType = 'json';
      xhr.addEventListener('load', function(){
        if (xhr.status === 200) {
          // If valid, send to bUsers
          const bookmarkedUserId = encodeURIComponent(xhr.response.id);
          const userEmail = encodeURIComponent(this.state.email);
          const formData = `bookmarkedUserId=${bookmarkedUserId}&userEmail=${userEmail}`;
          //*
          const xhrBUser = new XMLHttpRequest();
          xhrBUser.open('post', 'user/post/profile/add/bUser');

          xhrBUser.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
          xhrBUser.setRequestHeader('Authorization', `Bearer ${JSON.stringify(Auth.getToken())}`);
          xhrBUser.responseType = 'json';
          xhrBUser.addEventListener('load', function(){
            //console.log(xhrBUser.status);
          }.bind(this));
          xhrBUser.send(formData);
          //*/
        }
      }.bind(this));
      xhr.send();
    }
    //*/
    /* // Get matching users
    const xhr = new XMLHttpRequest();
    xhr.open('get', `user/get/chat/${this.props.email}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', function(){
      if (xhr.status === 200) {
      } else {
      }
      console.log('Get matched users ' + xhr.response);
    }.bind(this));
    xhr.send();
    //*/
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
      } else if (userList!==undefined && userList!==null) {
        let current = this.state.current;
        if (this.talkToEmail!==''&&this.talkToEmail!==undefined) {
          current = userList.indexOf(this.talkToEmail);
          if (current===-1) { // If not in the list, add it to the top of the list
            userList.splice(0, 0, this.talkToEmail);
            current = 0;
          }
        }

        this.setState({ users: userList, current });

        // Get names of users
        const userString = userList.toString();
        const xhr = new XMLHttpRequest();
        xhr.open('get', `user/get/profiles/${userString}`);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'json';
        xhr.addEventListener('load', function(){
          if (xhr.status === 200) {
            const names = [];
            let xhrIndex = 0;
            for (let i = 0; i < userList.length; i++) {
              if (xhr.response[xhrIndex].userEmail===userList[i]) {
                names.push(xhr.response[xhrIndex].userName);
                xhrIndex++;
              } else {
                names.push(null);
              }
            }
            this.setState({ names });
          }
        }.bind(this));
        xhr.send();
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
        names={this.state.names}
        current={this.state.current}
        changeConversation={this.changeConversation.bind(this)}
    email={this.state.email}
    talkToEmail={this.talkToEmail}
    />
    </div>
    );
  }
  return markup;
}

hasPeopleToTalkTo(){

  if (this.state.users!==undefined &&
      this.state.users!==null &&
      this.state.users.length===0) {
    return (
      <div style={{textAlign: 'center'}}>
      You have no one to talk to.<br/>
      Please find someone to talk to.
      <br/><br/>
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
  names={this.state.names}
  current={this.state.current}
  changeConversation={this.changeConversation.bind(this)}
  email={this.state.email}
  talkToEmail={this.talkToEmail}
  sockets={sockets}
  />
  </div>
  );
} //end-else
}

render() {
  return (
    <div id="chat">
    {this.hasPeopleToTalkTo()}
</div>
);
}
}

ChatView.propTypes = {
};
