import React from 'react';
import {Link} from 'react-router';
import sampleProjects from '../project/sampleData';

class EventView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDisplayProjects: false,
      projects: sampleProjects
    }

    this.displayAllProjects = this.displayAllProjects.bind(this);
  }

  displayAllProjects() {
    this.setState({
      isDisplayProjects: !this.state.isDisplayProjects
    });
  }

  render() {
    return (
      <div id="event-body" className="d-f1lex flex-column justify-content-center">
        <div className="row justify-content-center mb-4">
          <div className="col-md-6 col-12 text-center">
            <img className="img-fluid event-poster mb-2" src="../../resources/images/dummy-poster.png" alt="event-poster"/>
          </div>
          <div className="col-md-6 col-12">
            <h4 className="card-title">Event Name</h4>
            <p className="card-text">Event Venue & Date & Time</p>
          </div>
        </div>
        <div className="row mb-4">
          <div className="card col-md-7 col-12 mr-4">
            <div className="event-info card-block">
              <div className="info-type mb-2">Event Description</div>
              <hr/>
              <div className="mb-3">
                <button className="btn btn-success mr-2" onClick={this.displayAllProjects}>
                  {(this.state.isDisplayProjects)
                    ? "Hide Projects"
                    : "Show Projects"
                  }
                </button>
                <button className="btn btn-secondary">Sitemap</button>
              </div>
              {(this.state.isDisplayProjects)
                ? <div>
                    <div className="row">
                      <span className="input-group-addon">
                        <input type="checkbox"/>All
                      </span>
                      <span className="input-group-addon">
                        <input type="checkbox"/>Internship
                      </span>
                      <span className="input-group-addon">
                        <input type="checkbox"/>Partnership
                      </span>
                    </div>
                    <br/>
                    {this.state.projects.map((project, i) => <div className="d-flex flex-row mb-1" key={i}>
                      <img className="img-fluid project-thumbnail mr-2" src="../../resources/images/dummy-poster.png" alt="event-poster"/>
                      <div>
                        <div>{project.exhibitionName}</div>
                        <div>
                          {project.tags.map((tag, i) => <div key={i} className="badge badge-pill badge-info">{tag}</div>)}
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
              <div className="info-type">Organizer</div>
              <div className="event-name event-info"/>
              <div className="info-type">Organizer Info</div>
              <div id="event-desc" className="event-info"/>
              <hr/>
              <button className="btn btn-secondary">Website</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EventView;
