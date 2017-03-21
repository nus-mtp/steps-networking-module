import React, { Component } from 'react';
import MediaQuery from 'react-responsive';

export default class ChatBody extends Component {
  static PostSelf(text, key = 0) {
    return (
      <div className="container form-control" id="chat-self" key={key}>
        {text}
      </div>
    );
  }

  static PostOther(text, key = 0) {
    return (
      <div className="container-fluid form-control" id="chat-other" key={key}>
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

  constructor(props) {
    super(props);

    this.state = {
      messages: [
        ChatBody.PostSelf('Turkey', 0),
        ChatBody.PostOther('Bacon', 1),
        ChatBody.PostSelf('Test', 2),
      ],
    };

    this.placeholder = 'Type a message...';
    this.divStyle = {
      paddingLeft: '15px',
      marginLeft: this.props.marginLeft,
    };

    this.catchSubmit = this.catchSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkQuery = this.checkQuery.bind(this);
  }

  componentDidUpdate() {
    ChatBody.scrollToBottom();
    this.textInput.focus();
  }

  sendMessage(senderEmail, recipientEmail, content) {
    const body = {
      senderEmail,
      recipientEmail,
      content,
    };
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/message/post/newMessage');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        console.log("No Error lol");
      } else {
        // failure

        console.log("Error lol");
        console.log("xhr");
        console.log(xhr);
      }
    });
    xhr.send(body);
    
    return ChatBody.PostSelf(content, this.state.messages.length);
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
          {this.state.messages}
        </div>
      </div>
    );
  }

  checkQuery(matches) {
    let markup = (
      <div id="chat-body">
        {this.getCurrentConversation()}
        {this.getInputBox()}
      </div>
    );

    if (matches) {
      markup = (
        <div id="chat-body" style={this.divStyle}>
          {this.getCurrentConversation()}
          {this.getInputBox()}
        </div>
      );
    }

    return markup;
  }

  addMessages(text) {
    const messages = this.state.messages.slice();
    messages.push(text);
    this.setState({ messages }); // Replace the messages inside state
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
      const newDiv = this.sendMessage(
        this.props.email,
        this.props.users[this.props.current],
        this.textInput.value,
      );
      this.addMessages(newDiv);
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
}

ChatBody.propTypes = {
  marginLeft: React.PropTypes.string.isRequired,
  users: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  current: React.PropTypes.number.isRequired,
  query: React.PropTypes.string.isRequired,
  email: React.PropTypes.string.isRequired,
};
