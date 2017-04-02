import React from 'react';
import Tabs from './tabs';
import Event from './event';
import Collapsable from './collapsable';
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
      attendance: [],
      todayDate: nowDate,
      currentTab: 'ongoing',
      email: userEmail.replace(/%40/i, '@'),
    };

    this.initializeStates();
    this.getAttendances(userEmail.replace(/%40/i, '@'));

    this.openCollapsable = this.openCollapsable.bind(this);
    this.changeAttendance = this.changeAttendance.bind(this);
    this.changeView = this.changeView.bind(this);
    this.formatMilli = this.formatMilli.bind(this);
    this.createFalseArray = this.createFalseArray.bind(this);
    this.getAttendances = this.getAttendances.bind(this);
  }

  initializeStates() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/event/get/allEvents');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      console.log('initialize state success');
      if (xhr.status === 200) {
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
      } else {
        console.log('initialize state fail');
        this.setState({
          events: [],
          displayedEvents: [],
          open: [],
        });
      }
    });
    xhr.send();
  }

  getAttendances(email) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/attendance/get/oneUserAttendances/${email}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        console.log('get attendance success');
        this.setState({ attendance: xhr.response });
      } else {
        console.log('get attendance fail');
        this.setState({ attendance: [] });
      }
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
    const userEmail = encodeURIComponent(this.state.email);
    const eventName = encodeURIComponent(event.name);
    const formData = `userEmail=${userEmail}&eventName=${eventName}`;
    const xhr = new XMLHttpRequest();
    xhr.open('post', `attendance/post/oneEventAttendance/`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        console.log('change attendance success');
        this.getAttendances(this.state.email);
      } else {
        console.log('change attendance fail');
      }
    });
    xhr.send(formData);
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
                  email={this.state.email}
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
