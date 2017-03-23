import React from 'react';
import Paths from '../../paths';
import Auth from '../../database/auth';
import suggestions from './skillSuggestions';
import { Link } from 'react-router';
import { WithContext as ReactTags } from 'react-tag-input';

class ProfileView extends React.Component {
  constructor(props) {
    super(props);

    const userEmail = (Auth.isUserAuthenticated) ? Auth.getToken().email : '';

    this.state = {
      email: userEmail.replace(/%40/i, '@'),
      skills: [],
      links: 'N/A',
      projects: 'none',
      interestedEvents: 'none',
      interestedOpportunities: 'none',
      isContentEditable: false,
      pastUserData: {},
      user: {},
    };

    this.getUser();

    this.handleEdit = this.handleEdit.bind(this);
    this.changeEdit = this.changeEdit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDeleteSkill = this.handleDeleteSkill.bind(this);
    this.handleAdditionSkill = this.handleAdditionSkill.bind(this);
    this.handleDragSkill = this.handleDragSkill.bind(this);
  }

  getUser() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/user/get/profile/${this.state.email}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      /*if (xhr.response.userSkills) {
        xhr.response.userSkills.map((skill, i) => {
          return {
            id: i,
            text: skill,
          };
        });
      }*/

      this.setState({
        user: xhr.response,
        skills: (xhr.response.userSkills) ? xhr.response.userSkills.map((skill, i) => {
          return {
            id: i,
            text: skill,
          };
        }) : [],
      });
    });
    xhr.send();
  }

  handleDeleteSkill(i) {
    this.setState({
      skills: this.state.skills.filter((skill, index) => index !== i)
    });
  }

  handleDragSkill(skill, currPos, newPos) {
    const skills = [ ...this.state.skills ];

    // mutate array
    skills.splice(currPos, 1);
    skills.splice(newPos, 0, skill);

    // re-render
    this.setState({ skills });
  }

  handleAdditionSkill(skill) {
    this.setState({
      skills: [
        ...this.state.skills,
        {
          id: this.state.skills.length + 1,
          text: skill
        }
      ]
    });
  }

  changeEdit(event) {
    const targetId = event.target.id;
    if (targetId === 'new-user-email') {
      this.setState({
        email: event.target.value,
      });
    } else if (targetId === 'new-user-skills') {
      this.setState({
        skills: event.target.value,
      });
    } else if (targetId === 'new-user-description') {
      this.setState({
        description: event.target.value,
      });
    } else if (targetId === 'new-user-links') {
      this.setState({
        links: event.target.value,
      });
    }
  }

  handleEdit() {
    this.setState({
      isContentEditable: !this.state.isContentEditable,
      pastUserData: {
        email: this.state.email,
        skills: this.state.skills,
        links: this.state.links,
        projects: this.state.projects,
        interestedEvents: this.state.interestedEvents,
        interestedOpportunities: this.state.interestedOpportunities,
      },
    });
  }

  handleCancel() {
    this.setState({
      email: this.state.pastUserData.email,
      skills: this.state.pastUserData.skills,
      links: this.state.pastUserData.links,
      projects: this.state.pastUserData.projects,
      interestedEvents: this.state.pastUserData.interestedEvents,
      interestedOpportunities: this.state.pastUserData.interestedOpportunities,
      isContentEditable: false,
    });
  }

  render() {
    return (
      <div id="profile-body">
        <div className="row justify-content-between justify-content-md-around">
          <div id="profile-picture" className="col-md-6 push-md-3 col-12 text-center">
            <img src="../../resources/images/default-profile-picture.png" alt="profile-img" />
          </div>
          <div className="col-md-3 pull-md-6 col-6 text-center d-flex justify-content-center">
            <div id="chat-icon-container">
              <Link to={Paths.chat}>
                <img id="chat-icon" src="../../resources/images/chat-icon.svg" alt="chat-icon" />
              </Link>
            </div>
          </div>
          <div className="col-md-3 col-6 text-center d-flex justify-content-center" onClick={this.handleEdit}>
            <div id="edit-icon-container">
              <img id="edit-icon" src="../../resources/images/edit-icon.svg" alt="edit-icon" />
            </div>
          </div>
        </div>
        <div className="profile-info card">
          <div className="card-block">
            <div className="card-text">
              <h4 id="user-name" className="card-title">{this.state.user.userName}</h4>
              <div>
                <span className="info-type">Email: </span>
                { (this.state.isContentEditable) ?
                  <input id="new-user-email" type="email" className="form-control" value={this.state.email} onChange={this.changeEdit} /> :
                  <span id="user-email" className="user-info">{this.state.email}</span>
                }
              </div>
              <div>
                <span className="info-type">Description: </span>
                { (this.state.isContentEditable) ?
                  <input id="new-user-description" type="text" className="form-control" value={this.state.description} onChange={this.changeEdit} /> :
                  <span id="user-description" className="user-info">{this.state.user.userDescription}</span>
                }
              </div>
              <div>
                <span className="info-type">Skills: </span>
                { (this.state.isContentEditable) ?
                  <ReactTags
                    tags={this.state.skills}
                    suggestions={suggestions}
                    handleDelete={this.handleDeleteSkill}
                    handleAddition={this.handleAdditionSkill}
                    handleDrag={this.handleDragSkill}
                    placeholder="Add skills"
                  /> :
                  <div>
                    {
                      this.state.skills.map(skill =>
                        <span id="user-skills" className="user-info" key={`${skill.text}${skill.id}`}>{skill.text}</span>
                    )}
                  </div>
                }
              </div>
              <div>
                <span className="info-type">Links: </span>
                { (this.state.isContentEditable) ?
                  <input id="new-user-links" className="form-control" type="text" value={this.state.links} onChange={this.changeEdit} /> :
                  <a id="user-links" className="user-info" href={`https://${this.state.links}`}>{this.state.links}</a>
                }
              </div>
            </div>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <div className="info-type">Lists of Projects Involved: </div>
              <div id="user-projects" className="user-info">{this.state.projects}</div>
            </li>
            <li className="list-group-item">
              <div className="info-type">Interested Events: </div>
              <div id="user-events" className="user-info">{this.state.interestedEvents}</div>
            </li>
            <li className="list-group-item">
              <div className="info-type">What am I Looking For? </div>
              { (this.state.isContentEditable) ?
                <select className="form-control" id="new-user-interest">
                  <option>{this.state.interestedOpportunities}</option>
                  <option>2</option>
                </select> :
                <div id="user-info" className="user-info">{this.state.interestedOpportunities}</div>
              }
            </li>
          </ul>
          { (this.state.isContentEditable) ?
            <div className="card-block text-right">
              <button className="btn btn-primary post-edit" onClick={this.handleEdit}>Save</button>
              <button className="btn btn-secondary post-edit" onClick={this.handleCancel}>Cancel</button>
            </div> :
            <div />
          }
        </div>
      </div>
    );
  }
}

export default ProfileView;
