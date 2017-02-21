import React from 'react';

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
      numOfEvents: numOfEvents
    };
  }
  openCollapsable(serial) {
    var new_status = this.initial.slice(); // ignore previous state and change all to false
    new_status[serial] = !this.state.open[serial];
    this.setState({ open: new_status });
  }
  createView() {
    var view = [];
    var num = this.state.numOfEvents;
    for (var i = 0; i < num; i++) {
      if (i%2==0) {
        view.push(
          (<Event serial={i} open={this.state.open} openCollapsable={this.openCollapsable.bind(this)} />)
        );
        if (num%2==1 && i==num-1) {
          view.push(
            <Collapsable serial={i} open={this.state.open} openCollapsable={this.openCollapsable.bind(this)} />
          );
        }
      } else {
        view.push(
          (<Event serial={i} open={this.state.open} openCollapsable={this.openCollapsable.bind(this)} />)
        );
        view.push(
          <Collapsable serial={i-1} open={this.state.open} openCollapsable={this.openCollapsable.bind(this)} />
        );
        view.push(
          <Collapsable serial={i} open={this.state.open} openCollapsable={this.openCollapsable.bind(this)} />
        );
       }
    }
    return (
      <div className="row events-section justify-content-center">
        {view}
      </div>
    );
  }

  render() {
    return (
      <div className="home-body">
        <Tabs />
        {this.createView.bind(this).call()}
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
    this.props.openCollapsable(this.props.serial);
  }
  render() {
    return (
      <div>
        <div onClick={this.handleClick.bind(this)} className="event-picture" href={"#collapseExample"+this.props.serial}
           aria-expanded={this.props.open[this.props.serial]} aria-controls={"collapseExample"+this.props.serial}>
          <img className="img-fluid text-center event-poster" src="https://goo.gl/T2k8fq" alt="Event picture" />
          <div id="event-poster" />
        </div>
    </div>
    );
  }
}

class Collapsable extends React.Component {
  render() {
    let showCollapse = (this.props.open[this.props.serial]) ? 'collapse show' : 'collapse';
    return (
      <div className={showCollapse} id={"collapseExample"+this.props.serial-1} aria-expanded={this.props.open[this.props.serial]}>
        <div className="card card-block">
          <div>
            <h6>Title {this.props.serial}</h6>
            <div id="event-title" />
            <h6>Description {this.props.serial}</h6>
            <div id="event-description" />
          </div>
        </div>
      </div>
    );
  }
}

export default HomeView;
