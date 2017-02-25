import React from 'react';

class Tab extends React.Component {
  render() {
    return (
      <div className="event-tab">
        <li className="nav-item">
          <a className="nav-link" href="#">{this.props.name}</a>
        </li>
      </div>
    );
  }
}

export default Tab;
