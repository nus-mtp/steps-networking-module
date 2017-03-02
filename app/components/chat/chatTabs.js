import React, { Component } from 'react';

class ChatTabs extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      tabs: [this.inititaliseTabs()],
    };
    
    this.client = "turkey@bacon.com"; // the user who is logged in
    this.divStyle = {
      width: this.props.width,
    }
  }
  
  createTab(email, key=0) {
    return (
      <button 
        className="btn" 
        id="chat-tab" 
        key={key} 
        onClick={this.handleClick.bind(this)(key)}
      >
        {email}
      </button>
    );
  }

  inititaliseTabs() {
    const tabList = [];
    for (let i = 0; i < this.props.users.length; i++) {
      tabList.push(this.createTab.bind(this)(this.props.users[i], i));
    }
    return tabList;
  }
  
  handleClick(key) {
    return function (event) {
      this.props.changeConversation(key);
    }.bind(this);
  }

  render() {
    return (
      <div 
        className="btn-group-vertical" 
        role="group" 
        aria-label="" 
        id="chat-tabs" 
        style={this.divStyle} 
      >
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