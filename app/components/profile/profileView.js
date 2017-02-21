import React from 'react';
import { Link } from 'react-router';
import Paths from '../../paths';
import Database from '../../database/database'

class ProfileView extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<div id="profile-body">
			<div className="row justify-content-center">
				<div id="profile-picture" className="col-md-6 push-md-1 col-12 text-center">
					<img className="clickable" src="../../resources/images/default-profile-picture.png" alt="profile-picture" />
				</div>
				<div id="chat-icon" className="col-md-1 pull-md-6 col-6 text-center align-middle">
					<Link to={Paths.chat}>
						<img className="clickable" src="../../resources/images/chat-icon.png" alt="chat-icon" />
					</Link>
				</div>
				<div id="edit-icon" className="col-md-1 col-6 text-center">
					<img className="clickable" src="../../resources/images/edit-icon.png" alt="edit-icon" />
				</div>
				</div>
					<div className="profile-info">
					<div className="info-type">Name</div>
					<div id="user-name" className="user-info" />
					<div className="info-type">Email</div>
					<div id="user-email" className="user-info" />
					<div className="info-type">Description</div>
					<div id="user-desc" className="user-info" />
					<div className="info-type">Links</div>
					<div id="user-links" className="user-info" />
				</div>
				<div className="profile-info">
					<div className="info-type">Lists of Projects Involved</div>
					<div id="user-projects" />
				</div>
				<div className="profile-info">
					<div className="row justify-content-around">
						<div id="user-events" className="col-6 col-md-4">
							<div className="info-type text-center">Interested Events</div>
						</div>
						<div id="user-interest" className="col-6 col-md-4">
							<div className="info-type text-center">What am I Looking For?</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ProfileView;
