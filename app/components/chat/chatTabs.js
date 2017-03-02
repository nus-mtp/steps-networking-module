import React, { Component } from 'react';

class ChatTabs extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      tabs: [this.inititaliseTabs()],
    };
    
    this.client = "turkey@bacon.com"; // the user who is logged in
  }
  
  static createTab(email, key=0) {
    return (
      <button className="btn btn-default" id="chat-tab" key={key}>{email}</button>
    );
  }

  inititaliseTabs() {
    const tabList = [];
    for (let i = 0; i < this.props.userLength; i++) {
      tabList.push(ChatTabs.createTab(this.props.users[i], i));
    }
    return tabList;
  }
  
  render() {
    return (
      <div className="btn-group-vertical" role="group" aria-label="" id="chat-tabs">
        {this.state.tabs}
      </div>
    );
  }
}

ChatTabs.propTypes = {
  users: React.PropTypes.array.isRequired,
  current: React.PropTypes.number.isRequired,
};

export default ChatTabs;