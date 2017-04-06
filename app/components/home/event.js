import React from 'react';
import { Link } from 'react-router';

class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      participating: false,
    }

    this.isParticipatingEvent(this.props.event.name);

    this.handleClick = this.handleClick.bind(this);
    this.isEventAttended = this.isEventAttended.bind(this);
    this.isParticipatingEvent = this.isParticipatingEvent.bind(this);
  }

  isEventAttended() {
    for (const attend of this.props.attendance) {
      if (this.props.event.id === attend.attendanceKey) {
        return true;
      }
    }
    return false;
  }

  isParticipatingEvent(eventName) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/attendance/get/oneUserExhibitionsInEvent/${this.props.email}/${eventName}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({ participating: true});
      } else {
        this.setState({ participating: false});
      }
    });
    xhr.send();
  }

  handleClick() {
    this.props.openCollapsable(this.props.serial);
  }

  addDefaultSrc(event) {
    event.target.src = "../../resources/images/empty-poster-placeholder.png";
  }

  render() {
    const style = (this.props.open[this.props.serial]) ?
    {
      borderBottom: 'none',
      boxShadow: '2px 2px 15px 0px rgba(200,200,200,1)',
      zIndex: 0,
    } : {};

    const eventDate = new Date(this.props.event.start_date);

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
            {
              (this.props.event.event_poster) ?
                <embed
                  className="img-fluid text-center event-thumbnail card-img-top"
                  width="250"
                  height="auto"
                  src={this.props.event.event_poster.replace(/http/i, 'https')}
                  alt="event-poster"
                /> :
                <img className="img-fluid text-center event-thumbnail card-img-top" width="250" height="auto" src='../../resources/images/empty-poster-placeholder.png' alt="event-poster" />
            }
          </div>
          <div className="card-block event-info-container">
            <div className="card-title event-title">{this.props.event.name}</div>
            {
              (this.isEventAttended())
              ? <div className="badge badge-danger event-badge"><img id="attendance-badge-image" src="../../resources/images/check-icon.svg" alt="check-icon" />Attending</div>
              : <div />
            }
            {
              (this.state.participating)
              ? <div className="badge badge-warning exhib-badge"><img id="participating-badge-image" src="../../resources/images/check-icon.svg" alt="check-icon" />Participating</div>
              : <div />
            }
            {
              (this.isEventAttended() || this.state.participating)
              ? <div />
              : <div className="offset-badge" />
            }
            <div className="event-info">{eventDate.toDateString()}</div>
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
  event: React.PropTypes.objectOf(React.PropTypes.any).isRequired,
  attendance: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
};

export default Event;
