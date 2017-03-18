import React from 'react';

class Tabs extends React.Component {
  render() {
    return (
      <div className="event-tabs">
        <ul className="nav nav-tabs justify-content-between" role="tablist">
          <li className="nav-item">
            <a className="nav-link active" data-toggle="tab" href="#ongoing" role="tab">Ongoing</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#upcoming" role="tab">Upcoming</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#past" role="tab">Past</a>
          </li>
        </ul>

        <div className="tab-content">
          <div className="tab-pane active" id="ongoing" role="tabpanel"></div>
          <div className="tab-pane" id="upcoming" role="tabpanel"></div>
          <div className="tab-pane" id="past" role="tabpanel"></div>
        </div>
      </div>
    );
  }
}

export default Tabs;
