import React from 'react';
import Tabs from './tabs';
import Event from './event';
import Collapsable from './collapsable';
import { sampleAttendance } from './sampleData';

class HomeView extends React.Component {
  constructor(props) {
    super(props);

    const numOfEvents = 10; // Change according to num of events Refactor
    this.initial = [];
    for (let i = 0; i < numOfEvents; i++) {
      this.initial.push(false);
    }
    const nowDate = new Date();

    this.state = {
      open: this.initial,
      numOfEvents: numOfEvents,
      events: null,
      displayedEvents: [],
      attendance: sampleAttendance,
      todayDate: nowDate,
    };

    this.getAllEvents();

    this.openCollapsable = this.openCollapsable.bind(this);
    this.changeAttendance = this.changeAttendance.bind(this);
    this.changeView = this.changeView.bind(this);
    this.formatMilli = this.formatMilli.bind(this);
  }

  getAllEvents() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/event/get/allEvents');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      const nowTime = this.state.todayDate.getTime();
      const copy = xhr.response;
      const remainder = copy.filter((event) => {
        if (nowTime > this.formatMilli(event.start_date) && nowTime < this.formatMilli(event.end_date))
          return event;
      });
      this.setState({
        events: xhr.response,
        displayedEvents: remainder,
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

  formatMilli(dateString) {
    const date = new Date(dateString);
    return date.getTime();
  }

  changeView(e) {
    const id = e.target.id;
    const copy = this.state.events.slice();
    const nowTime = this.state.todayDate.getTime();
    let remainder;
    switch (id) {
      case 'ongoing':
        remainder = copy.filter((event) => {
          if (nowTime > this.formatMilli(event.start_date) && nowTime < this.formatMilli(event.end_date))
            return event;
        });
        break;
      case 'upcoming':
        remainder = copy.filter((event) => {
          if (nowTime < this.formatMilli(event.start_date))
            return event;
        });
        break;
      case 'past':
        remainder = copy.filter((event) => {
          if (nowTime > this.formatMilli(event.end_date))
            return event;
        });
        break;
      default:
        alert('no such id!');
    }
    this.setState({displayedEvents: remainder});
  }

  render() {
    const containerWidth = 290;

    return (
      <div id="home-body">
        <Tabs onClick={this.changeView} />
        <div id="event-list" className="d-flex justify-content-center justify-content-md-start">
        {
          (this.state.displayedEvents.length !== 0) ?
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
            ) : <div>Sorry!There are no events here!</div>
          }
        </div>
      </div>
    );
  }
}

export default HomeView;
