import React, { Component } from 'react';

class ChatTabs extends Component {
  constructor(props) {
    super(props);

    this.divStyle = {
      width: this.props.width,
    };
  }

  createTab(email, key = 0, selected = -1) {
    const buttonStyle = {};
    if (selected === key) {
      buttonStyle.backgroundColor = 'mediumslateblue';
      buttonStyle.color = 'white';
    }

    return (
      <button
        className="btn"
        id="chat-tab"
        key={key}
        onClick={this.handleClick.bind(this)(key)}
        style={buttonStyle}
      >
        {email}
      </button>
    );
  }

  inititaliseTabs(selected = 0) {
    const tabList = [];
    if (this.props.names && this.props.users &&
      this.props.names.length===this.props.users.length) {
      for (let i = 0; i < this.props.users.length; i += 1) {
        if (this.props.names[i]!==null) {
          tabList.push(this.createTab.bind(this)(this.props.names[i], i, selected));
        } else if (this.props.users[i]===this.props.talkToEmail) { // that means name is null
          tabList.splice(0, 0, this.createTab.bind(this)(this.props.users[i], i, selected));
        }
      }
    } else if (this.props.users) {
      for (let i = 0; i < this.props.users.length; i += 1) {
        tabList.push(this.createTab.bind(this)(this.props.users[i], i, selected));
      }
    }
    return tabList;
  }

  handleClick(key) {
    return function changeConversation(event) {
      event.preventDefault();
      this.props.changeConversation(key);
    }.bind(this);
  }

  render() {
    return (
      <div
        id="chat-sidebar"
        style={this.divStyle}
      >
        <div
          className="btn-group-vertical"
          role="group"
          aria-label=""
          id="chat-tabs"
        >
          {this.inititaliseTabs(this.props.current)}
        </div>
      </div>
    );
  }
}

ChatTabs.propTypes = {
  users: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  names: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  current: React.PropTypes.number.isRequired,
  width: React.PropTypes.string.isRequired,
  changeConversation: React.PropTypes.func.isRequired,
  email: React.PropTypes.string.isRequired,
  talkToEmail: React.PropTypes.string.isRequired,
};

export default ChatTabs;
