import React from 'react';

function Tabs(props) {
  let ongoing = '';
  let upcoming = '';
  let past = '';

  if (props.tab === 'ongoing') {
    ongoing = 'active';
    upcoming = '';
    past = '';
  } else if (props.tab === 'upcoming') {
    ongoing = '';
    upcoming = 'active';
    past = '';
  } else if (props.tab === 'past') {
    ongoing = '';
    upcoming = '';
    past = 'active';
  }

  return (
    <div id="event-tabs">
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <a id="ongoing" className={`nav-link ${ongoing}`} data-toggle="tab" href="#ongoing" role="tab" onClick={props.onClick}>Ongoing</a>
        </li>
        <li className="nav-item">
          <a id="upcoming" className={`nav-link ${upcoming}`} data-toggle="tab" href="#upcoming" role="tab" onClick={props.onClick}>Upcoming</a>
        </li>
        <li className="nav-item">
          <a id="past" className={`nav-link ${past}`} data-toggle="tab" href="#past" role="tab" onClick={this.props.onClick}>Past</a>
        </li>
      </ul>
    </div>
  );
}

Tabs.propTypes = {
  tab: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
};

export default Tabs;
