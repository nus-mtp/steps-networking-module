import React from 'react';
import { Link } from 'react-router';
import Paths from '../../paths';
import ReactSwipe from 'react-swipe';
import sampleProjects from './sampleData';

class Match extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: sampleProjects,
    }
  }

  next() {
    this.refs.reactSwipe.next();
  }

  prev() {
    this.refs.reactSwipe.prev();
  }

  render() {
    return(
      <ReactSwipe ref="reactSwipe" className="carousel" swipeOptions={{continuous: false}} id="match-body">
      {
        this.state.projects.map((project, i) =>
          <div key={i}>
            <div className="row justify-content-center">
              <div id="match-project-poster-container" className="d-flex justify-content-center">
                <img className="img-fluid project-poster" src="../../resources/images/dummy-poster.png" alt="project-poster" />
              </div>
            </div>
            <div className="row justify-content-center">
              <h3 className="project-name project-info">{project.exhibitionName}</h3>
            </div>
            <div className="row justify-content-center">
              {
                project.tags.map((tag, i) =>
                  <div className="badge badge-pill badge-info reason-tag" key={i}>{tag}</div>
              )}
            </div>
            <div className="row justify-content-center">
              <button type="button" className="match-button col-4 col-md-4 btn btn-secondary" onClick={::this.prev}>
                <img className="match-icons" src="../../resources/images/chevron-left.svg" />Prev
              </button>
              <button type="button" className="match-button col-3 col-md-3 btn btn-success">
                <img className="match-icons" src="../../resources/images/favorite-icon.svg" />
              </button>
              <button type="button" className="match-button col-4 col-md-4 btn btn-secondary" onClick={::this.next}>
                <img className="match-icons" src="../../resources/images/chevron-right.svg" />Next
              </button>
            </div>
            <hr className="divider" />
            <div className="more-info text-center">
              <Link to={Paths.project}>More Info</Link>
            </div>
          </div>
        )
      }
      </ReactSwipe>
    );
  }
}

Match.propTypes = {
  tags: React.PropTypes.array,
}

export default Match;
