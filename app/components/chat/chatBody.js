import React, { Component } from 'react';
import MediaQuery from 'react-responsive';

export default class ChatBody extends Component {
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
      marginLeft: this.props.marginLeft,
    }
  }

  static PostSelf(text, key=0) {
    return (
      <div className="container form-control" id="chat-self" key={key}>
        {text}
      </div>
    );
  }

  static PostOther(text, key=0) {
    return (
      <div className="container-fluid form-control" id="chat-other" key={key}>
        {text}
      </div>
    );
  }

  static scrollToBottom() {
    document.body.scrollTop = document.body.scrollHeight;
  }

  componentDidUpdate() {
    ChatBody.scrollToBottom();
  }

  addMessages(text) {
    const messages = this.state.messages.slice();
    messages.push(text);
    this.setState({ messages }); // Replace the messages inside state
  }

  handleChange() {
    if (this.refs.chatInput.value === '\n') {
      this.refs.chatInput.value = '';
    }
  }

  handleSubmit() {
    const str = this.refs.chatInput.value;
    const strStrip = str.trim();
    if (strStrip.length > 0) {
      const newDiv = ChatBody.PostSelf(this.refs.chatInput.value, this.state.messages.length);
      this.addMessages(newDiv);
    }
    this.refs.chatInput.value = '';
  }

  catchSubmit(e) {
    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();
      this.handleSubmit();
    }
    return true;
  }
  
  inputBox() {
    return (
      <div className="fixed-bottom" id="chat-form-container">
        <textarea
          className="form-control"
          ref="chatInput"
          id="chat-input"
          placeholder={this.placeholder}
          onKeyDown={this.catchSubmit.bind(this)}
        />
        <button
          type="button"
          id="chat-submit-button"
          className="btn btn-default"
          onClick={this.handleSubmit.bind(this)}
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

  checkQuery(matches) {
    if (matches) {
      return (
        <div id="chat-body" style={this.divStyle}>
          <div id="chat-content-container">
            {this.state.messages}
          </div>
          {this.inputBox()}
        </div>
      );
    } else {
      return (
        <div id="chat-body">
          <div id="chat-content-container">
            {this.state.messages}
          </div>
          {this.inputBox()}
        </div>
      );
    }
  }

  render() {
    return (
      <MediaQuery query={this.props.query}>
        {this.checkQuery.bind(this)}
      </MediaQuery>
    );
  }
}
