import React from 'react';
import Tabs from './tabs';
import Event from './event';
import Collapsable from './collapsable';
import { sampleAttendance } from './sampleData';

class HomeView extends React.Component {
  constructor(props) {
    super(props);

    const numOfEvents = 8; // Change according to num of events
    this.initial = [];
    for (let i = 0; i < numOfEvents; i++) {
      this.initial.push(false);
    }

    this.state = {
      open: this.initial,
      numOfEvents: numOfEvents,
      events: null,
      attendance: sampleAttendance,
    };

    this.getAllEvents();

    this.openCollapsable = this.openCollapsable.bind(this);
    this.changeAttendance = this.changeAttendance.bind(this);
  }

  getAllEvents() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/event/get/allEvents');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      this.setState({
        events: xhr.response,
      });
    });
    xhr.send();
  }

  openCollapsable(serial) {
    const newStatus = this.initial.slice(); // ignore previous state and change all to false
    newStatus[serial] = !this.state.open[serial];
    this.setState({ open: newStatus });
  }

  changeAttendance(event, attendance) {
    // modify attendance data here
    if (attendance) {
      const newEvent = { name: event };
      const newAttendance = this.state.attendance;
      newAttendance.push(newEvent);
      this.setState({
        attendance: newAttendance,
      });
    } else {
      const newAttendance = this.state.attendance.filter(attend => attend.name !== event);
      this.setState({
        attendance: newAttendance,
      });
    }
  }

  render() {
    const containerWidth = 290;

    return (
      <div id="home-body">
        <Tabs />
        <div id="event-list" className="d-flex justify-content-center justify-content-md-start">
        {
          (this.state.events !== null) ?
            this.state.events.map((event, i) =>
              <div id="event-container" key={i}>
                <Event
                  serial={i}
                  open={this.state.open}
                  openCollapsable={this.openCollapsable}
                  event={event}
                  attendance={this.state.attendance}
                />
                <Collapsable
                  serial={i}
                  open={this.state.open}
                  openCollapsable={this.openCollapsable}
                  width={containerWidth}
                  event={event}
                  attendance={this.state.attendance}
                  changeAttendance={this.changeAttendance}
                />
              </div>
            ) : <div />
          }
        </div>
      </div>
    );
  }
}

export default HomeView;
