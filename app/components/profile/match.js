import React from 'react';
import { Link } from 'react-router';
import Paths from '../../paths';
import ReactSwipe from 'react-swipe';
import sampleUsers from './sampleUsers';

class Match extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: sampleUsers,
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
      <ReactSwipe ref="reactSwipe" className="carousel" swipeOptions={{continuous: false}}>
      {
        this.state.users.map((user, i) =>
          <div key={i} className="d-flex align-items-center flex-column">
            <div className="match-button-lg-prev d-flex flex-column hidden-sm-down" onClick={::this.prev}>
              <img className="match-icons" src="../../resources/images/chevron-left.svg" />
              <div>Prev</div>
            </div>
            <div className="match-button-lg-next d-flex flex-column hidden-sm-down" onClick={::this.next}>
              <img className="match-icons" src="../../resources/images/chevron-right.svg" />
              <div>Next</div>
            </div>
            <div id="match-body">
              <div className="row justify-content-between justify-content-md-around">
                <div className="col-md-3 text-center d-flex justify-content-center hidden-sm-down">
                  <div id="chat-icon-container">
                    <Link to={Paths.chat}>
                      <img id="chat-icon" src="../../resources/images/chat-icon.svg" alt="chat-icon" />
                    </Link>
                  </div>
                </div>
                <div id="match-user-poster-container" className="col-12 col-md-6 text-center">
                  <img className="img-fluid user-image" src="../../resources/images/default-profile-picture.png" />
                </div>
                <div className="col-md-3 text-center d-flex justify-content-center hidden-sm-down">
                  <div id="match-icon-container">
                    <img id="match-icon" src="../../resources/images/favorite-large-icon.svg" alt="match-icon" />
                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                <h3 className="user-name user-info">{user.name}</h3>
              </div>
              <div className="row justify-content-center">
                {
                  user.skills.map((skill, i) =>
                    <div className="badge badge-pill badge-info reason-tag" key={i}>{skill}</div>
                )}
              </div>
              <div className="row justify-content-center hidden-md-up">
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
              <div className="more-info text-center hidden-md-up">
                <Link to={`/profile/${user.email}`}>More Info</Link>
              </div>
              <div className="hidden-sm-down">
                <div className="profile-info card">
                  <div className="card-block">
                    <div className="card-text">
                      <div>
                        <span className="info-type">Email: </span>
                        <span id="user-email" className="user-info">{user.email}</span>
                      </div>
                      <div>
                        <span className="info-type">Description: </span>
                        <span id="user-desc" className="user-info">{user.description}</span>
                      </div>
                      <div>
                        <span className="info-type">Links: </span>
                        <span id="user-links" className="user-info"></span>
                      </div>
                    </div>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <div className="info-type">Lists of Projects Involved: </div>
                      <div id="user-projects" className="user-info"></div>
                    </li>
                    <li className="list-group-item">
                      <div className="info-type">Interested Events: </div>
                      <div id="user-events" className="user-info"></div>
                    </li>
                    <li className="list-group-item">
                      <div className="info-type">What am I Looking For? </div>
                      <div id="user-info" className="user-info"></div>
                    </li>
                  </ul>
                </div>
              </div>
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
