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
import { Link } from 'react-router';
import sampleOrganizer from './sampleOrganizer';
import EventMap from './eventMap';
import NotFound from '../home/notFound';

class EventView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDisplayExhibitions: false,
      isDisplayAttendees: false,
      is404: false,
      exhibitions: [], // This is for all exhibitions
      displayExhibitions: [], // This is for the displayed exhibitions
      attendees: [],
      event: [],
      organizer: sampleOrganizer,
      eventTags: [],
      selectedTag: 'All',
    };

    this.getEvent();
    this.getExhibitions();
    this.getAttendees();

    this.displayEventMap = this.displayEventMap.bind(this);
    this.displayAllExhibitions = this.displayAllExhibitions.bind(this);
    this.displayAllAttendees = this.displayAllAttendees.bind(this);
    this.onClick = this.onClick.bind(this);
    this.updateDisplayedExhibitions = this.updateDisplayedExhibitions.bind(this);
    this.removeDuplicates = this.removeDuplicates.bind(this);
    this.toTitleCase = this.toTitleCase.bind(this);
  }

  componentDidMount() {
    const that = this;
    window.addEventListener('hashchange', () => {
      that.getEvent();
      that.getExhibitions();
      that.getAttendees();
    });
  }

  componentWillUnmount() {
    const that = this;
    window.removeEventListener('hashchange', () => {
      that.getEvent();
      that.getExhibitions();
      that.getAttendees();
    });
  }

  onClick(e) {
    this.updateDisplayedExhibitions(e.target.id);
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
        const tags = xhr.response.map(exhibition => exhibition.tags[1]);
        const tagsNoDuplicates = this.removeDuplicates(tags);
        this.setState({
          exhibitions: xhr.response,
          displayExhibitions: xhr.response,
          eventTags: tagsNoDuplicates,
        });
      } else {
        this.setState({
          exhibitions: [],
          displayExhibitions: [],
          eventTags: [],
        });
      }
    });
    xhr.send();
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

  removeDuplicates(arr) {
    return Array.from(new Set(arr));
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

  /**
    * Display modules that contains the id
    * @param id of the JSX element
    */
  updateDisplayedExhibitions(id) {
    const newDisplay = this.state.exhibitions.filter((exhibition) => {
      if (exhibition.tags[1] === id) return exhibition;
    });
    this.setState({
      displayExhibitions: newDisplay,
      selectedTag: id,
    });
  }

  addDefaultSrc(event) {
    event.target.src = '../../resources/images/empty-poster-placeholder.png';
  }

  toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      ),
    );
  }

  render() {
    const startDate = (this.state.event) ? new Date(this.state.event.start_date).toDateString() : '';
    const endDate = (this.state.event) ? new Date(this.state.event.end_date).toDateString() : '';

    return (
      (this.state.is404) ? <NotFound /> :
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
                <button className="btn btn-primary mt-4" onClick={this.displayEventMap}>Sitemap</button>
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
              <hr />
              <div className="mb-3">
                <button className="btn btn-success mr-2" onClick={this.displayAllAttendees}>
                  {
                    (this.state.isDisplayAttendees)
                    ? 'Hide attendees'
                    : 'Show attendees'
                  }
                </button>
                <button className="btn btn-info mr-2" onClick={this.displayAllExhibitions}>
                  {
                    (this.state.isDisplayExhibitions)
                    ? 'Hide exhibitions'
                    : 'Show exhibitions'
                  }
                </button>
                {
                  (this.state.isDisplayExhibitions) ?
                    <div id="dropdown-button" className="dropdown">
                      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {this.state.selectedTag.toUpperCase()}
                      </button>
                      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        {
                          this.state.eventTags.map(tag =>
                            <a key={tag} id={tag} className="dropdown-item" onClick={this.onClick}>{tag.toUpperCase()}</a>,
                          )
                        }
                      </div>
                    </div> :
                    <div />
                }
              </div>
              {
                (this.state.isDisplayAttendees) ?
                  <div>
                    {
                      this.state.attendees.map(attendees =>
                        <Link id="exhibition-container" to={`/profile/${attendees.userEmail}`} key={attendees.userEmail}>
                          <div id="attendees" className="d-flex flex-row mb-1 align-items-center">
                            <div>
                              <div>{this.toTitleCase(attendees.userName)}</div>
                            </div>
                          </div>
                        </Link>,
                    )}
                  </div> :
                  <div />
              }
              {
                (this.state.isDisplayExhibitions) ?
                  <div>
                    <br />
                    {
                      this.state.displayExhibitions.map(exhibition =>
                        <Link id="exhibition-container" to={`/exhibition/${this.state.event.name}/${exhibition.exhibitionName}`} key={exhibition.id}>
                          <div id="exhibition" className="d-flex flex-row mb-1 align-items-center">
                            {
                              (exhibition.poster) ?
                                <div className="d-flex justify-content-center align-items-center thumbnail-container">
                                  <img className="img-fluid project-thumbnail" src={exhibition.poster} onError={this.addDefaultSrc} alt="event-poster" />
                                </div> :
                                <div className="d-flex justify-content-center thumbnail-container">
                                  <img className="img-fluid project-thumbnail" src="../../resources/images/empty-poster-placeholder.png" alt="event-poster" />
                                </div>
                            }
                            <div>
                              <div>{exhibition.exhibitionName}</div>
                              <div>
                                {exhibition.tags.map(tag => <div key={tag} className="badge badge-pill badge-warning event-tag">{tag}</div>)}
                              </div>
                            </div>
                          </div>
                        </Link>,
                    )}
                  </div> :
                  <div />
              }
            </div>
          </div>
          <div className="card col-md-4 col-12">
            <div className="event-info card-block">
              <h6 className="event-name">{this.state.organizer.name}</h6>
              <div className="event-info">{this.state.organizer.description}</div>
              <hr />
              <a href={`${this.state.organizer.link}`}><button className="btn btn-secondary">Website</button></a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EventView.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

EventView.propTypes = {
  location: React.PropTypes.object.isRequired,
};


export default EventView;
