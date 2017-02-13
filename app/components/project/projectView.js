import React from 'react';

class ProjectView extends React.Component {
  render() {
    return (
      <div id="project-body">

        <div className="row justify-content-center">
          <div id="project-poster">
            <img  src="https://goo.gl/uYtfxK" alt="project-poster" />
          </div>
        </div>

        <div className="exhibition-info">
          <div className="info-type">Project Title</div>
          <div id="project-name" className="project-info" />
          <div className="info-type">Description</div>
          <div id="project-desc" className="project-info" />
          <div className="info-type">Tags</div>
          <div id="project-tags" className="project-info" />
        </div>

        <div className="exhibition-info">
          <div className="info-type">Related Media / URLs</div>
          <div id="project-url" />
          <div id="project-media" />
        </div>

        <div className="exhibition-info">
          <div className="info-type">Project Members</div>
          <div id="project-members" />
        </div>

        

      </div>
    );
  }
}

export default ProjectView;
