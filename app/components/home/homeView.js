/*
   eslint-disable array-callback-return,
   jsx-a11y/no-static-element-interactions,
   react/jsx-no-bind,
   class-methods-use-this,
   consistent-return,
   no-param-reassign,
   react/forbid-prop-types,
*/

import React from 'react';
import SearchInput from '../search/searchInputView';
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

    this.retrieveData();

    this.openCollapsable = this.openCollapsable.bind(this);
    this.changeAttendance = this.changeAttendance.bind(this);
    this.changeView = this.changeView.bind(this);
    this.formatMilli = this.formatMilli.bind(this);
    this.createFalseArray = this.createFalseArray.bind(this);
    this.getAttendances = this.getAttendances.bind(this);
  }

  /**
    * Sets priority of event view
    */
  setDefaultView() {
    const copy = this.state.events.slice();

    const nowTime = this.state.todayDate.getTime();
    const ongoing = copy.filter((event) => {
      if (nowTime > this.formatMilli(event.start_date) &&
        nowTime < this.formatMilli(event.end_date)) {
        return event;
      }
    });
    const upcoming = copy.filter((event) => {
      if (nowTime < this.formatMilli(event.start_date)) {
        return event;
      }
    });
    const past = copy.filter((event) => {
      if (nowTime > this.formatMilli(event.end_date)) {
        return event;
      }
    });

    let defaultTab = 'ongoing';
    let display = ongoing;
    if (ongoing.length === 0 && upcoming.length !== 0) {
      defaultTab = 'upcoming';
      display = upcoming;
    } else if (ongoing.length === 0 && upcoming.length === 0 && past.length !== 0) {
      defaultTab = 'past';
      display = past;
    }

    this.setState({
      currentTab: defaultTab,
      displayedEvents: display,
      open: this.createFalseArray(display.length),
      error: '',
    });
  }

  getAttendances() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/attendance/get/oneUserAttendances/${this.state.email}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({ attendance: xhr.response });
      } else {
        this.setState({ attendance: [] });
      }

      if (this.state.displayedEvents.length === 0) {
        this.setDefaultView();
      }
    });
    xhr.send();
  }

  retrieveData() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', '/event/get/allEvents');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({
          events: xhr.response,
        });

        this.getAttendances();
      } else {
        this.setState({
          events: [],
          displayedEvents: [],
          open: [],
        });
      }
    });
    xhr.send();
  }

  createFalseArray(n) {
    const array = [];
    for (let i = 0; i < n; i += 1) {
      array.push(false);
    }
    return array;
  }

  /**
    * Only one element in this.state.open can be true at all times.
    * Toggle boolean at the index serial.
    */
  openCollapsable(serial) {
    // ignore previous state and change all to false
    const newStatus = this.createFalseArray(this.state.open.length);
    newStatus[serial] = !this.state.open[serial];
    this.setState({ open: newStatus });
  }

  /**
    * Toggle the attendance of a user.
    * Will ONLY work if user is not participating in the event in the @param
    * Status 423 will be given when trying to violate the rule
    */
  changeAttendance(event) {
    const userEmail = encodeURIComponent(this.state.email);
    const eventName = encodeURIComponent(event.name);
    const formData = `userEmail=${userEmail}&eventName=${eventName}`;
    const xhr = new XMLHttpRequest();
    xhr.open('post', 'attendance/post/oneEventAttendance/');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', `Bearer ${JSON.stringify(Auth.getToken())}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.getAttendances();
      }
    });
    xhr.send(formData);
  }

  formatMilli(dateString) {
    const date = new Date(dateString);
    return date.getTime();
  }


  /**
    * Invoked when user changes tab
    */
  changeView(e) {
    const id = e.target.id;
    const copy = this.state.events.slice();
    const nowTime = this.state.todayDate.getTime();
    let remainder;
    switch (id) {
      case 'ongoing':
        remainder = copy.filter((event) => {
          if (nowTime > this.formatMilli(event.start_date) &&
            nowTime < this.formatMilli(event.end_date)) {
            return event;
          }
        });
        break;
      case 'upcoming':
        remainder = copy.filter((event) => {
          if (nowTime < this.formatMilli(event.start_date)) {
            return event;
          }
        });
        break;
      case 'past':
        remainder = copy.filter((event) => {
          if (nowTime > this.formatMilli(event.end_date)) {
            return event;
          }
        });
        break;
      default:
        this.setState({
          error: 'No such id',
        });
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
        <div id="home-background" className="hidden-md-down">
          <div id="home-search-container">
            <h2 id="search-title">Find An Opportunity</h2>
            <SearchInput />
          </div>
        </div>

        <div id="home-content-container">
          <Tabs onClick={this.changeView} tab={this.state.currentTab} />
          <div id="event-list" className="d-flex justify-content-center justify-content-md-start">
            {
              (this.state.displayedEvents.length !== 0) ?
                this.state.displayedEvents.map((event, i) =>
                  <div id="event-container" key={event.id}>
                    <Event
                      serial={i}
                      open={this.state.open}
                      openCollapsable={this.openCollapsable}
                      event={event}
                      attendance={this.state.attendance}
                      email={this.state.email}
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
                  </div>,
                ) : <div className="no-events justify-content-center">
                  <p>
                    Sorry! There are no {this.state.currentTab} events.
                    Please check again in the future!
                  </p>
                </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default HomeView;
