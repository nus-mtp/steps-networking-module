import React from 'react';
import Tabs from './tabs';
import Event from './event';
import Collapsable from './collapsable';
import { sampleAttendance } from './sampleData';
import Auth from '../../database/auth';

class HomeView extends React.Component {
  constructor(props) {
    super(props);

    const nowDate = new Date();
    const userEmail = (Auth.isUserAuthenticated()) ? Auth.getToken().email : '';

    this.state = {
      open: null,
      events: null,
      displayedEvents: [],
      attendance: sampleAttendance,
      todayDate: nowDate,
      currentTab: 'ongoing',
    };

    this.initializeStates();
    this.getAttendances(userEmail.replace(/%40/i, '@'));

    this.openCollapsable = this.openCollapsable.bind(this);
    this.changeAttendance = this.changeAttendance.bind(this);
    this.changeView = this.changeView.bind(this);
    this.formatMilli = this.formatMilli.bind(this);
    this.createFalseArray = this.createFalseArray.bind(this);
  }

  initializeStates() {
    //const userEmail = (Auth.isUserAuthenticated()) ? Auth.getToken().email : '';
    //console.log(userEmail.replace(/%40/i, '@'));
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
        open: this.createFalseArray(remainder.length),
      });
    });
    xhr.send();
  }

  getAttendances(email) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/attendance/get/oneUserAttendances/${email}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      this.setState({ attendance: xhr.response });
    });
    xhr.send();
  }

  createFalseArray(n) {
    let array = [];
    for (let i = 0; i < n; i += 1) {
      array.push(false);
    }
    return array;
  }

  openCollapsable(serial) {
    const newStatus = this.createFalseArray(this.state.open.length); // ignore previous state and change all to false
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
    this.setState({
      displayedEvents: remainder,
      currentTab: id,
      open: this.createFalseArray(remainder.length),
    });
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
            ) : <div className="no-events justify-content-center">
                  <img src="../resources/images/sad-face.png" alt="Sorry-no-events" />
                  <p>Sorry! There are no {this.state.currentTab} events. Please check again in the future!</p>
                </div>
          }
        </div>
      </div>
    );
  }
}

export default HomeView;
