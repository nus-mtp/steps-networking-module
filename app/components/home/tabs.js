import React from 'react';

class Tabs extends React.Component {
  render() {
    return (
      <div className="event-tabs">
        <ul className="nav nav-tabs justify-content-between" role="tablist">
          <li className="nav-item">
            <a id="ongoing" className="nav-link active" data-toggle="tab" href="#ongoing" role="tab" onClick={this.props.onClick}>Ongoing</a>
          </li>
          <li className="nav-item">
            <a id="upcoming" className="nav-link" data-toggle="tab" href="#upcoming" role="tab" onClick={this.props.onClick}>Upcoming</a>
          </li>
          <li className="nav-item">
            <a id="past" className="nav-link" data-toggle="tab" href="#past" role="tab" onClick={this.props.onClick}>Past</a>
          </li>
        </ul>


      </div>
    );
  }
}

export default Tabs;

/*<div className="tab-content">
  <div className="tab-pane active" id="ongoing" role="tabpanel"></div>
  <div className="tab-pane" id="upcoming" role="tabpanel"></div>
  <div className="tab-pane" id="past" role="tabpanel"></div>
</div>*/
