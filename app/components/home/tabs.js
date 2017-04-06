import React from 'react';

class Tabs extends React.Component {
  render() {
    let ongoing = '';
    let upcoming = '';
    let past = '';

    if (this.props.tab === 'ongoing') {
      ongoing = 'active'
      upcoming = '';
      past = '';
    } else if (this.props.tab === 'upcoming') {
      ongoing = ''
      upcoming = 'active';
      past = '';
    } else if (this.props.tab === 'past') {
      ongoing = ''
      upcoming = '';
      past = 'active';
    }

    return (
      <div className="event-tabs">
        <ul className="nav nav-tabs" role="tablist">
          <li className="nav-item">
            <a id="ongoing" className={`nav-link ${ongoing}`} data-toggle="tab" href="#ongoing" role="tab" onClick={this.props.onClick}>Ongoing</a>
          </li>
          <li className="nav-item">
            <a id="upcoming" className={`nav-link ${upcoming}`} data-toggle="tab" href="#upcoming" role="tab" onClick={this.props.onClick}>Upcoming</a>
          </li>
          <li className="nav-item">
            <a id="past" className={`nav-link ${past}`} data-toggle="tab" href="#past" role="tab" onClick={this.props.onClick}>Past</a>
          </li>
        </ul>
      </div>
    );
  }
}

Tabs.propTypes = {
  tab: React.PropTypes.string.isRequired,
}

export default Tabs;
