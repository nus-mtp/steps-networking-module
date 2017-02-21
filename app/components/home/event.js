import React from 'react';

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

export default Event;
