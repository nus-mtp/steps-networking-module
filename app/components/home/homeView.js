import React from 'react';
import Tabs from './tabs';
import Event from './event';
import Collapsable from './collapsable';

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

export default HomeView;
