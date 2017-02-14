import React from 'react';

class ProjectView extends React.Component {
  render() {
    return (
      <div id="project-body">

        <div className="row justify-content-center">
          <div id="project-poster">
            <img className="img-fluid" src="../../resources/images/dummy-poster.png" alt="project-poster" />
          </div>
        </div>

        <div className="exhibition-info">
          <div className="info-type">Project Title: </div>
          <div id="project-name" className="project-info" />
          <div className="info-type">Description: </div>
          <div id="project-desc" className="project-info" />
          <div className="info-type">Tags: </div>
          <div id="project-tags" className="project-info" />
        </div>

        <div className="exhibition-info text-center">
          <div className="info-type">Related Media / URLs</div>
          <div id="project-url" />
          <div id="project-media" />
        </div>

        <div className="exhibition-info text-center">
          <div className="info-type">Project Members</div>
          <div id="project-members" />

          <button id="broadcast-msg" type="button" className="btn btn-info">Broadcast Message</button>
        </div>

        <div className="exhibition-info text-center">
          <div className="info-type">Comments</div>
          <div id="project-comments" />
          <div className="form-group">
            <textarea className="form-control" rows="1" id="comment"></textarea>
          </div>
          <button id="submit-comment" type="button" className="btn btn-primary">Submit</button>
        </div>

      </div>
    );
  }
}

export default ProjectView;
