import React from 'react';

class HomeView extends React.Component {
  render() {
    return (
      <div className="home-body">
        <Tabs />
        <div className="row events-section justify-content-center">
          <Event serial="1" />
          <Event serial="1" />
          <Collapsable serial="1" />
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
  render() {
    return (
      <div>
        <div onClick={this.handleClick} className="event-picture" data-toggle="collapse" href={"#collapseExample"+this.props.serial}
          aria-expanded="false" aria-controls={"collapseExample"+this.props.serial}>
          <img className="img-fluid text-center event-poster" src="https://goo.gl/T2k8fq" alt="Event picture" />
          <div id="event-id" />
        </div>
    </div>
    );
  }
}

class Collapsable extends React.Component {
  render() {
    return (
      <div className="collapse" id={"collapseExample"+this.props.serial}>
        <div className="card card-block">
          <div>
            <h2>Title</h2>
            <div id="event-title" />
            <h4>Description</h4>
            <div id="event-description" />
          </div>
        </div>
      </div>
    );
  }
}

export default HomeView;
