import React from 'react';
import { Link } from 'react-router';
import Paths from '../../paths';

class ProfileView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: 'N/A',
      description: 'N/A',
      links: 'N/A',
      interestedEvents: 'none',
      interedtedOpportunities: 'none',
    };
  }

  render() {
    return (
      <div id="profile-body">
        <div className="row justify-content-around justify-content-md-center">
          <div id="profile-picture" className="col-md-6 push-md-1 col-12 text-center">
            <img className="clickable" src="../../resources/images/default-profile-picture.png" />
          </div>
          <div id="chat-icon" className="col-md-1 pull-md-6 col-6 text-center">
            <Link to={Paths.chat}>
              <img className="clickable" src="../../resources/images/chat-icon.svg" alt="chat-icon" />
            </Link>
          </div>
          <div id="edit-icon" className="col-md-1 col-6 offset-lg-1 text-center">
            <Link to="">
              <img className="clickable" src="../../resources/images/edit-icon.svg" alt="edit-icon" />
            </Link>
          </div>
        </div>
        <div className="profile-info card">
          <div className="card-block">
            <div className="card-text">
              <h4 id="user-name" className="card-title">Anonymous</h4>
              <div>
                <span className="info-type">Email:</span>
                <span id="user-email" className="user-info">{this.state.email}</span>
              </div>
              <div>
                <span className="info-type">Description:</span>
                <span id="user-desc" className="user-info">{this.state.description}</span>
              </div>
              <div>
                <span className="info-type">Links:</span>
                <span id="user-links" className="user-info">{this.state.links}</span>
              </div>
            </div>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <div className="info-type">Lists of Projects Involved:</div>
              <div id="user-projects" className="user-info">{this.state.links}</div>
            </li>
            <li className="list-group-item">
              <div className="info-type">Interested Events:</div>
              <div id="user-events" className="user-info">{this.state.interestedEvents}</div>
            </li>
            <li className="list-group-item">
              <div className="info-type">What am I Looking For?</div>
              <div id="user-info" className="user-info">{this.state.interedtedOpportunities}</div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ProfileView;
