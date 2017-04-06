import React from 'react';
import { Link } from 'react-router';
import sampleOrganizer from './sampleOrganizer';
import EventMap from './eventMap';


class EventView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDisplayExhibitions: false,
      isDisplayAttendees: false,
      exhibitions: [], // This is for all exhibitions
      displayExhibitions: [], // This is for the displayed exhibitions
      attendees: [],
      event: [],
      organizer: sampleOrganizer,
    }

    this.getEvent();
    this.getExhibitions();
    this.getAttendees();

    this.displayAllExhibitions = this.displayAllExhibitions.bind(this);
    this.displayAllAttendees= this.displayAllAttendees.bind(this);
    this.onClick = this.onClick.bind(this);
    this.updateDisplayedExhibitions = this.updateDisplayedExhibitions.bind(this);
  }

  componentDidMount() {
    const that = this;
    window.addEventListener("hashchange", () => {
      that.getEvent();
      that.getExhibitions();
      that.getAttendees();
    });
  }

  componentWillUnmount() {
    const that = this;
    window.removeEventListener("hashchange", () => {
      that.getEvent();
      that.getExhibitions();
      that.getAttendees();
    });
  }

  getAttendees() {
    const pathname = this.props.location.pathname;
    const eventName = pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length);

    const xhr = new XMLHttpRequest();
    xhr.open('get', `/attendance/get/oneEventAttendees/${eventName}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.response !== null) {
        // success
        this.setState({
          attendees: xhr.response,
        });
      } else {
        this.setState({
          attendees: [],
        });
      }
    });
    xhr.send();
  }

  getExhibitions() {
    const pathname = this.props.location.pathname;
    const eventName = pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length);

    const xhr = new XMLHttpRequest();
    xhr.open('get', `/exhibition/get/oneEventExhibitions/${eventName}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.response !== null) {
        // success
        this.setState({
          exhibitions: xhr.response,
          displayExhibitions: xhr.response,
        });
      } else {
        this.setState({
          exhibitions: [],
          displayExhibitions: [],
        });
      }
    });
    xhr.send();
  }

  getEvent() {
    const pathname = this.props.location.pathname;
    const eventName = pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length);

    const xhr = new XMLHttpRequest();
    xhr.open('get', `/event/get/oneEvent/${eventName}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.response !== null) {
        // success
        this.setState({
          event: xhr.response,
        });
      } else {
        this.setState({
          event: [],
        });
      }
    });
    xhr.send();
  }

  displayAllExhibitions() {
    this.setState({
      isDisplayExhibitions: !this.state.isDisplayExhibitions,
      isDisplayAttendees: false,
    });
  }

  displayAllAttendees() {
    this.setState({
      isDisplayAttendees: !this.state.isDisplayAttendees,
      isDisplayExhibitions: false,
    });
  }

  displayEventMap() {
    this.setState({
      showEventMap: !this.state.showEventMap,
    });
    // Also forcefully open Projects
    if (!this.state.showEventMap) {
      this.setState({
        isDisplayProjects: true,
      });
    }
  }

  updateDisplayedExhibitions(id) {
    if (id === "all") {
      this.setState({displayExhibitions: this.state.exhibitions});
    } else {
      const remainder = this.state.exhibitions.slice();
      const result = remainder.filter((exhibition) => {
        if (exhibition.tags.includes(id))
            return exhibition;
      });
    this.setState({displayExhibitions: result});
    }
  }

  onClick(e) {
    switch (e.target.id) {
      case "all":
        document.getElementById("internship").checked = false;
        document.getElementById("partnership").checked = false;
        document.getElementById("full-time").checked = false;
        break;
      case "internship":
        document.getElementById("all").checked = false;
        document.getElementById("partnership").checked = false;
        document.getElementById("full-time").checked = false;
        break;
      case "partnership":
        document.getElementById("all").checked = false;
        document.getElementById("internship").checked = false;
        document.getElementById("full-time").checked = false;
        break;
      case "full-time":
        document.getElementById("all").checked = false;
        document.getElementById("internship").checked = false;
        document.getElementById("partnership").checked = false;
        break;
      default:
        alert("Unknown");
    }
    this.updateDisplayedExhibitions(e.target.id);
  }

  addDefaultSrc(event) {
    event.target.src = "../../resources/images/empty-poster-placeholder.png";
  }

  render() {
    const startDate = (this.state.event) ? new Date(this.state.event.start_date).toDateString() : '';
    const endDate = (this.state.event) ? new Date(this.state.event.end_date).toDateString() : '';

    return (
      <div id="event-body" className="d-f1lex flex-column justify-content-center">
        <div className="row justify-content-center mb-1">
          <div className="col-md-6 col-12 text-center">
          {
            (this.state.event.event_poster) ?
              <embed
                className="img-fluid event-poster mb-1"
                src={this.state.event.event_poster.replace(/http/i, 'https')}
                alt="event-poster"
              /> :
              <img className="img-fluid event-poster mb-1" src="../../resources/images/empty-poster-placeholder.png" alt="event-poster" />
          }
          </div>
          {
            (this.state.event != null) ?
              <div className="col-md-6 col-12">
                <h4 className="card-title">{this.state.event.name}</h4>
                <div className="card-text">
                  <div className="event-info">{this.state.event.venue}</div>
                  <div className="event-info">
                  {
                    (startDate === endDate)
                    ? `${startDate}`
                    : `${startDate} - ${endDate}`
                  }
                  </div>
                </div>
                <br />
                <div className="event-info">Attendance: {this.state.attendees.length}</div>
                <div className="event-info">Exhibitions: {this.state.exhibitions.length}</div>
                <button className="btn btn-info mt-4" onClick={this.displayEventMap.bind(this)}>Sitemap</button>
              </div>
            : <div />
          }
        </div>

        <EventMap
          showEventMap={this.state.showEventMap}
        />

        <div className="row mb-4">
          <div className="card col-md-7 col-12 mr-4">
            <div className="card-block">
              <div className="event-info mb-2">{this.state.event.description}</div>
              <hr/>
              <div className="mb-3">
                <button className="btn btn-success mr-2" onClick={this.displayAllAttendees}>
                  {
                    (this.state.isDisplayAttendees)
                    ? "Hide attendees"
                    : "Show attendees"
                  }
                </button>
                <button className="btn btn-success mr-2" onClick={this.displayAllExhibitions}>
                  {
                    (this.state.isDisplayExhibitions)
                    ? "Hide exhibitions"
                    : "Show exhibitions"
                  }
                </button>
              </div>
              {
                (this.state.isDisplayAttendees)
                ? <div>
                    {
                      this.state.attendees.map((attendees, i) =>
                      <Link id="exhibition-container" to={`/profile/${attendees.userEmail}`} key={i}>
                        <div id="attendees" className="d-flex flex-row mb-1 align-items-center">
                          <div>
                            <div>{attendees.userName}</div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                : <div/>
              }
              {
                (this.state.isDisplayExhibitions)
                ? <div>
                    <div className="row">
                      <span className="input-group-addon">
                        <input id="all" type="checkbox" onClick={this.onClick} defaultChecked/>All
                      </span>
                      <span className="input-group-addon">
                        <input id="internship" type="checkbox" onClick={this.onClick}/>Internship
                      </span>
                      <span className="input-group-addon">
                        <input id="partnership" type="checkbox" onClick={this.onClick}/>Partnership
                      </span>
                      <span className="input-group-addon">
                        <input id="full-time" type="checkbox" onClick={this.onClick}/>Full time
                      </span>
                    </div>
                    <br/>
                    {
                      this.state.displayExhibitions.map((exhibition, i) =>
                      <Link id="exhibition-container" to={`/exhibition/${this.state.event.name}/${exhibition.exhibitionName}`} key={i}>
                        <div id="exhibition" className="d-flex flex-row mb-1 align-items-center">
                          {
                            (exhibition.poster)
                            ? <div className="d-flex justify-content-center align-items-center thumbnail-container">
                              <img className="img-fluid project-thumbnail" src={exhibition.poster} onError={this.addDefaultSrc} alt="event-poster" />
                              </div>
                            : <div className="d-flex justify-content-center thumbnail-container">
                              <img className="img-fluid project-thumbnail" src="../../resources/images/empty-poster-placeholder.png" alt="event-poster" />
                              </div>
                          }
                          <div>
                            <div>{exhibition.exhibitionName}</div>
                            <div>
                              {exhibition.tags.map((tag, i) => <div key={i} className="badge badge-pill badge-info">{tag}</div>)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                : <div/>
              }
            </div>
          </div>
          <div className="card col-md-4 col-12">
            <div className="event-info card-block">
              <h6 className="event-name">{this.state.organizer.name}</h6>
              <div className="event-info">{this.state.organizer.description}</div>
              <hr/>
              <a href={`${this.state.organizer.link}`}><button className="btn btn-secondary">Website</button></a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EventView;
