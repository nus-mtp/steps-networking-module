import React from 'react';
import Tabs from './tabs';
import Event from './event';
import Collapsable from './collapsable';
import { sampleEvents, sampleAttendance, nowDate, futureDate, pastDate } from './sampleData';

class HomeView extends React.Component {
  constructor(props) {
    super(props);

    var numOfEvents = 8; // Change according to num of events
    this.initial = [];
    for (var i = 0; i < numOfEvents; i++) {
      this.initial.push(false);
    }

    this.state = {
      open: this.initial,
      numOfEvents: numOfEvents,
      events: sampleEvents,
      displayedEvents: sampleEvents,
      attendance: sampleAttendance,
    };

    this.openCollapsable = this.openCollapsable.bind(this);
    this.changeAttendance = this.changeAttendance.bind(this);
    this.changeView = this.changeView.bind(this);
  }

  openCollapsable(serial) {
    var new_status = this.initial.slice(); // ignore previous state and change all to false
    new_status[serial] = !this.state.open[serial];
    this.setState({ open: new_status });
  }

  changeAttendance(event, attendance) {
    // modify attendance data here
    if (attendance) {
      const newEvent = { name: event }
      const newAttendance = this.state.attendance;
      newAttendance.push(newEvent)
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

  changeView(e) {
    const id = e.target.id;
    const copy = this.state.events.slice();
    let remainder;

    if (id === "ongoing") {
      remainder = copy.filter((event) => {if (event.date === nowDate.toDateString()) return event;});
    } else if (id === "upcoming") {
      remainder = copy.filter((event) => {if (event.date === futureDate.toDateString()) return event;});
    } else {
      remainder = copy.filter((event) => {if (event.date === pastDate.toDateString()) return event;});
    }
    this.setState({displayedEvents: remainder});
  }

  render() {
    const containerWidth = 290;
    return (
      <div id="home-body">
        <Tabs onClick={this.changeView}/>
        <div id="event-list" className="d-flex justify-content-center justify-content-md-start"> {
          this.state.displayedEvents.map((event, i) =>
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
          )}
        </div>
      </div>
    );
  }
}

export default HomeView;
