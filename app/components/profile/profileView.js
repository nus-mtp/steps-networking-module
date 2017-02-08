import React from 'react';

class ProfileView extends React.Component {
  render() {
    return (
      <div id="profile-body">
        <div className="row justify-content-center">
          <div id="profile-picture" className="col-md-6 push-md-1 col-12">
          </div>
          <div id="chat-icon" className="col-md-1 pull-md-6 col-6">
          </div>
          <div id="edit-icon" className="col-md-1 col-6">
          </div>
        </div>
        <div className="profile-info">
          <div className="info-type">Name</div>
          <div id="user-name" />
          <div className="info-type">Email</div>
          <div id="user-email" />
          <div className="info-type">Description</div>
          <div id="user-desc" />
          <div className="info-type">Links</div>
          <div id="user-links" />
        </div>
        <div className="profile-info">
          <div className="info-type">Lists of Projects Involved</div>
          <div id="user-projects" />
        </div>
        <div className="profile-info">
          <div className="row justify-content-around">
            <div id="user-events" className="col-6 col-md-4">
              <div className="info-type">Interested Events</div>
            </div>
            <div id="user-interest" className="col-6 col-md-4">
              <div className="info-type">What am I Looking For?</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileView;
