import React from 'react';

class ProjectView extends React.Component {
  render() {
    return (
      <div id="project-body">
        <div className="row justify-content-center">
          <div>
            <img className="img-fluid project-poster" src="../../resources/images/dummy-poster.png" alt="project-poster" />
          </div>
        </div>
        <div className="card">
          <div className="exhibition-info card-block">
            <div className="info-type">Project Title: </div>
            <div className="project-name project-info" />
            <div className="info-type">Description: </div>
            <div id="project-desc" className="project-info" />
            <div className="info-type">Tags: </div>
            <div id="project-tags" className="project-info" />
          </div>
          <ul className="list-group list-group-flush">
            <li className="exhibition-info text-center list-group-item">
              <div className="info-type">Related Media / URLs</div>
              <div id="project-url" />
              <div id="project-media" />
            </li>

            <li className="exhibition-info text-center list-group-item">
              <div className="info-type">Project Members</div>
              <div id="project-members" />

              <button id="broadcast-msg" type="button" className="btn btn-info">Broadcast Message</button>
            </li>

            <li className="exhibition-info text-center card-block list-group-item">
              <div className="info-type">Comments</div>
              <div id="project-comments" />
              <div>
                <textarea className="form-control" rows="1" id="comment" />
              </div>
              <button id="submit-comment" type="button" className="btn btn-primary">Submit</button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ProjectView;
