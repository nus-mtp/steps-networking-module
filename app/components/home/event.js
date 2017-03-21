import React from 'react';
import { Link } from 'react-router';

class Event extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.isEventAttended = this.isEventAttended.bind(this);
  }

  isEventAttended() {
    for (const attend of this.props.attendance) {
      if (this.props.event.name === attend.name) {
        return true;
      }
    }

    return false;
  }

  handleClick() {
    this.props.openCollapsable(this.props.serial);
  }

  render() {
    const style = (this.props.open[this.props.serial]) ?
    {
      borderBottom: 'none',
      boxShadow: '2px 2px 15px 0px rgba(200,200,200,1)',
      zIndex: 0,
    } : {};

    return (
      <div id="event-info">
        <div
          onClick={this.handleClick}
          style={style}
          className="event-picture card"
          aria-expanded={this.props.open[this.props.serial]}
        >
          <div id="event-image-container">
            <Link to={`/event/${this.props.event.name}`}>
              <button className="btn btn-danger event-img-button">
                <img src="../../resources/images/pageview-icon.svg" alt="pageview-icon" />
              </button>
            </Link>
            <img id="event-poster" className="img-fluid text-center event-poster card-img-top" src="../../resources/images/dummy-poster.png" alt="event-poster" />
          </div>
          <div className="card-block event-info-container">
            <div className="card-title event-title">{this.props.event.name}</div>
            {
              (this.isEventAttended())
              ? <div className="attendance-badge"><img id="attendance-badge-image" src="../../resources/images/check-icon.svg" alt="check-icon" />Attending</div>
              : <div className="attendance-badge" />
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
  open: React.PropTypes.arrayOf(React.PropTypes.bool).isRequired,
  openCollapsable: React.PropTypes.func.isRequired,
  event: React.PropTypes.objectOf(React.PropTypes.string).isRequired,
  attendance: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};

export default Event;
