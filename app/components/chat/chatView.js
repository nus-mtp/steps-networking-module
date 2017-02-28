import React, { Component } from 'react';

export default class ChatView extends Component {
  static PostSelf(text) {
    return (
      <div className="container form-control" id="chat-self">
        {text}
      </div>
    );
  }

  static PostOther(text) {
    return (
      <div className="container-fluid form-control" id="chat-other">
        {text}
      </div>
    );
  }

  static scrollToBottom() {
    document.body.scrollTop = document.body.scrollHeight;
  }

  constructor(props) {
    super(props);

    this.state = {
      messages: [
        ChatView.PostSelf('Turkey'),
        ChatView.PostOther('Bacon'),
        ChatView.PostSelf('Test'),
      ],
    };

    this.placeholder = 'Type a message...';
  }

  componentDidUpdate() {
    ChatView.scrollToBottom();
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
      const newDiv = ChatView.PostSelf(this.refs.chatInput.value);
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

  render() {
    return (
      <div className="container" id="chat-body">
        <div className="container-fluid" id="chat-content-container">
          {this.state.messages}
        </div>
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
      </div>
    );
  }
}
