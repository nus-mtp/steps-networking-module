import React, { Component } from 'react';
import MediaQuery from 'react-responsive';

const sockets = io();

export default class ChatBody extends Component {
  constructor(props) {
    super(props);
    
    // Map functions to the class for easier handling    
    this.catchSubmit = this.catchSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkQuery = this.checkQuery.bind(this);
    
    // Get all messages for both sender and receiver
    this.initialiseMessages();

    this.state = {
      messages: [
        ChatBody.PostSelf('Turkey', 0),
        ChatBody.PostOther('Bacon', 1),
        ChatBody.PostSelf('Test', 2),
      ],
      //update: true,
    };

    this.update = true;
    this.placeholder = 'Type a message...';
    this.divStyle = {
      paddingLeft: '15px',
      marginLeft: this.props.marginLeft,
    };
    
    sockets.on('refresh message', function(results){
      console.log("Refreshed");
      this.initialiseMessages();
    }.bind(this));
  }

  componentDidUpdate() {
    if (this.update) {
      this.initialiseMessages();
    }
    ChatBody.scrollToBottom();
    this.textInput.focus();
  }
  
  retrieveAllMessages(senderEmail, recipientEmail) {
    //*
    sockets.emit('get message', { senderEmail, recipientEmail }, function(err, conversation) {
      if (err) {
        this.setState({[`${senderEmail}`]: [] });
      } else {
        this.setState({[`${senderEmail}`]: conversation.messages });
      }
    }.bind(this));
  }
  
  initialiseMessages() {
    const senderEmail = this.props.email;
    const recipientEmail = this.props.users[this.props.current];
    
    if (!senderEmail||!recipientEmail) {
      if (!this.update) {
        //console.log("Failed to get messages");
        this.update = true;
      }
    } else {
      this.getReceivedMessages();
      this.getSentMessages();
      this.update = false;
    }
  }
  
  getReceivedMessages() {
    const senderEmail = this.props.email;
    const recipientEmail = this.props.users[this.props.current];
    this.retrieveAllMessages(recipientEmail, senderEmail);
  }
  
  getSentMessages() {
    const senderEmail = this.props.email;
    const recipientEmail = this.props.users[this.props.current];
    this.retrieveAllMessages(senderEmail, recipientEmail);
  }

  sendMessage(senderEmail, recipientEmail, content) {
    sockets.emit('add message', { senderEmail, recipientEmail, content }, function(successful) {
      if (!successful) {
        console.log("The message failed to send.");
      } else {
        console.log(content);
        this.initialiseMessages();
      }
    }.bind(this));
  }
  
  createPostList(array = [], postFunc = ChatBody.PostSelf) {
    if (array.length==0) {
      return [];
    } else {
      return array.map(function(object, index) {
        // return an object that has been made into a post and keep time stamp
        return { 
          content: postFunc(object.content, index),
          timestamp: object.timestamp,
        };
      });
    }
  }

  // Expects to receive arrays made of objects containing { content, timestamp }. Sorts by timestamp
  mergeSortLists(list1 = [], list2 = []) {
    const mergedList = [];
    let i = 0;
    let j = 0;
    while (i < list1.length && j < list2.length) {
      if (list1[i].timestamp < list2[j].timestamp) {
        mergedList.push(list1[i].content);
        i++;
      } else {
        mergedList.push(list2[j].content);
        j++;
      }
    }
    
    while(i < list1.length) {
      mergedList.push(list1[i].content);
      i++;
    }
    
    while(j < list2.length) {
      mergedList.push(list2[j].content);
      j++;
    }
    
    return mergedList;
  }
  
  getMessages() {
    const userEmail = this.props.email;
    const recipientEmail = this.props.users[this.props.current];
    
    if (this.state[userEmail]!=null && 
      this.state[recipientEmail]!=null && // if not null and
      (this.state[userEmail].length!=0 ||
      this.state[recipientEmail].length!=0)) { // if not empty
      
      return this.mergeSortLists(
        this.createPostList(this.state[userEmail], ChatBody.PostSelf),
        this.createPostList(this.state[recipientEmail], ChatBody.PostOther)
      );
      /*
      .map(function(object){ // return only the div objects
        return object.content;
      })//*/
    }
    else {
      return (
        <div className="container-fluid" style={{textAlign: 'center'}}>
          You have no messages with this person.
        </div>
      );
    }
  }

  getInputBox() {
    return (
      <div className="fixed-bottom" id="chat-form-container">
        <textarea
          className="form-control"
          ref={(input) => { this.textInput = input; }}
          id="chat-input"
          placeholder={this.placeholder}
          onKeyDown={this.catchSubmit}
        />
        <button
          type="button"
          id="chat-submit-button"
          className="btn btn-default"
          onClick={this.handleSubmit}
        >
          <img
            id="chat-submit-image"
            src="../../resources/images/ic_send_24dp.png"
            alt="Submit"
          />
        </button>
      </div>
    );
  }

  getCurrentConversation() {
    return (
      <div>
        <div className="container" id="chat-name-header">
          {ChatBody.getUserName(this.props.users[this.props.current])}
        </div>
        <div id="chat-content-container">
          {this.getMessages.bind(this)()}
        </div>
      </div>
    );
  }

  checkQuery(matches) {
    let divStyle = {};
    if (matches) {
      divStyle = this.divStyle;
    }
    
    return (
      <div id="chat-body" style={divStyle}>
        {this.getCurrentConversation()}
        {this.getInputBox()}
      </div>
    );
  }

  handleChange() {
    if (this.textInput.value === '\n') {
      this.textInput.value = '';
    }
  }

  handleSubmit() {
    const str = this.textInput.value;
    const strStrip = str.trim();
    if (strStrip.length > 0) {
      this.sendMessage(
        this.props.email,
        this.props.users[this.props.current],
        this.textInput.value,
      );
    }
    this.textInput.value = '';
  }

  catchSubmit(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      this.handleSubmit();
    }
    return true;
  }

  render() {
    return (
      <MediaQuery query={this.props.query}>
        {this.checkQuery}
      </MediaQuery>
    );
  }

 /* Static functions used throughout */
  static PostSelf(text, key = 0) {
    key = 's' + key;
    return ChatBody.createPost(text, 'chat-self', key);
  }

  static PostOther(text, key = 0) {
    key = 'o' + key;
    return ChatBody.createPost(text, 'chat-other', key);
  }

  static createPost(text, id, key = 0) {
    return (
      <div className="container-fluid form-control" id={id} key={key}>
        {text}
      </div>
    );
  }

  static scrollToBottom() {
    document.body.scrollTop = document.body.scrollHeight;
  }

  static getUserName(email) {
    const str = `Name of ${email}`;
    return str;
  }

}

ChatBody.propTypes = {
  marginLeft: React.PropTypes.string.isRequired,
  users: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  current: React.PropTypes.number.isRequired,
  query: React.PropTypes.string.isRequired,
  email: React.PropTypes.string.isRequired,
};
