import React from 'react';

class HomeView extends React.Component {
  render() {
    return (
      <div className="home-body">
        <Tabs />
        <div className="row events-section justify-content-center">
          <Event />
          <Event />
        </div>
      </div>
    );
  }
}

class Tabs extends React.Component {
  render() {
    return (
      <div className="event-tabs">
        <ul className="nav nav-tabs justify-content-around">
          <Tab name="Ongoing" />
          <Tab name="Upcoming" />
          <Tab name="Past" />
        </ul>
      </div>
    );
  }
}

class Tab extends React.Component {
  render() {
    return (
      <div className="event-tab">
        <li className="nav-item">
          <a className="nav-link" href="#">{this.props.name}</a>
        </li>
      </div>
    );
  }
}

class Event extends React.Component {
  handleClick(event) {
    console.log("Hello");
  }

  render() {
    return (
      <div onClick={this.handleClick.bind(this)} className="event-picture">
        <img className="img-fluid event-poster" src="https://goo.gl/T2k8fq" alt="Event picture" />
        <div id="event-id" />
      </div>
    );
  }
}

export default HomeView;
