import React from 'react';
import { Link } from 'react-router';
import { sampleProjects } from '../project/sampleData';
import sampleOrganizer from './sampleOrganizer';

class EventView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDisplayExhibitions: false,
      exhibitions: [], // This is for all exhibitions
      displayExhibitions: [], // This is for the displayed exhibitions
      event: [],
      organizer: sampleOrganizer,
    }

    this.getEvent();
    this.getExhibitions();

    this.displayAllExhibitions = this.displayAllExhibitions.bind(this);
    this.onClick = this.onClick.bind(this);
    this.updateDisplayedExhibitions = this.updateDisplayedExhibitions.bind(this);
  }

  getExhibitions() {
    const pathname = this.props.location.pathname;
    const eventName = pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length);

    const xhr = new XMLHttpRequest();
    xhr.open('get', `/exhibition/get/oneEventExhibition/${eventName}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      this.setState({
        exhibitions: xhr.response,
        displayExhibitions: xhr.response,
      });
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
      this.setState({
        event: xhr.response,
      });
    });
    xhr.send();
  }

  displayAllExhibitions() {
    this.setState({
      isDisplayExhibitions: !this.state.isDisplayExhibitions
    });
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

  render() {
    const startDate = new Date(this.state.event.start_date).toDateString();
    const endDate = new Date(this.state.event.end_date).toDateString();

    return (
      <div id="event-body" className="d-f1lex flex-column justify-content-center">
        <div className="row justify-content-center mb-4">
          <div className="col-md-6 col-12 text-center">
          {
            (this.state.event_poster)
              ? <img className="img-fluid event-poster mb-2" src={`${this.state.event.event_poster}`} alt="event-poster"/>
              : <img className="img-fluid event-poster mb-2" src="../../resources/images/empty-poster-placeholder.png" alt="event-poster"/>
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
              </div>
            : <div />
          }
        </div>
        <div className="row mb-4">
          <div className="card col-md-7 col-12 mr-4">
            <div className="card-block">
              <div className="event-info mb-2">{this.state.event.description}</div>
              <hr/>
              <div className="mb-3">
                <button className="btn btn-success mr-2" onClick={this.displayAllExhibitions}>
                  {(this.state.isDisplayExhibitions)
                    ? "Hide exhibitions"
                    : "Show exhibitions"
                  }
                </button>
                <button className="btn btn-info" data-toggle="modal" data-target="#sitemap">Sitemap</button>
                <div className="modal fade" id="sitemap" tabIndex="-1" role="dialog" aria-hidden="true">
                  <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Event Name</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <img className="img-fluid" src="../resources/images/dummy-floorplan.jpg"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {(this.state.isDisplayExhibitions)
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
                    {this.state.displayExhibitions.map((exhibition, i) => <div className="d-flex flex-row mb-1" key={i}>
                      {
                        (exhibition.poster)
                        ? <div className="d-flex justify-content-center thumbnail-container">
                          <img className="img-fluid project-thumbnail" src={exhibition.poster} alt="event-poster" />
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
                    </div>)}
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
