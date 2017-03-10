import React from 'react';

class Event extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.isEventAttended = this.isEventAttended.bind(this);
  }

  isEventAttended() {
    for (let attend of this.props.attendance) {
      if (this.props.event.name == attend.name) {
        return true;
      }
    }

    return false;
  }

  handleClick(event) {
    this.props.openCollapsable(this.props.serial);
  }

  render() {
    let style = (this.props.open[this.props.serial]) ?
      {
        borderBottom: 'none',
        boxShadow: '2px 2px 15px 0px rgba(200,200,200,1)',
        zIndex: 0, 
      } : {};

    return (
      <div id="event-info">
        <div onClick={this.handleClick} style={style} className="event-picture card"
           aria-expanded={this.props.open[this.props.serial]}>
          <div id="event-image-container">
            <img id="event-poster" className="img-fluid text-center event-poster card-img-top" src="../../resources/images/dummy-poster.png" alt="Event picture" />
          </div>
          <div className="card-block event-info-container">
            <div className="card-title event-title">{this.props.event.name}</div>
            {
              (this.isEventAttended())
              ? <div className="attendance-badge"><img id="attendance-badge-image" src="../../resources/images/check-icon.svg" />Attending</div>
              : <div className="attendance-badge"/>
            }
            <div className="event-info">{this.props.event.date}</div>
            <div className="event-info">{this.props.event.venue}</div>
          </div>
        </div>
    </div>
    );
  }
}

Event.propTypes = {
  serial: React.PropTypes.number.isRequired,
  open: React.PropTypes.array.isRequired,
  openCollapsable: React.PropTypes.func.isRequired,
  event: React.PropTypes.object,
  attendance: React.PropTypes.array,
};

export default Event;
