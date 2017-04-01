import React from 'react';
import Paths from '../../paths';
import Auth from '../../database/auth';
import suggestions from './skillSuggestions';
import { Link } from 'react-router';
import { WithContext as ReactTags } from 'react-tag-input';

class ProfileView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      skills: [], // Skills that the user claimed to have
      links: '-', // Link to user profile of another website
      interestedOpportunities: '-', // What am I looking for
      isContentEditable: false, //  Edit mode
      pastUserData: {}, // State restore if user cancel edit
      user: {
        userSkills: [],
      },
      events: [], // List of event user attended
      exhibitions: [], // List of exhibition user participated
      attendances: [], // For all the attendance objects
    };

    const pathname = this.props.location.pathname;
    const userEmail = pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length);

    this.getUser(userEmail);
    this.getEvent(userEmail);
    this.getAttendances(userEmail);

    this.handleEdit = this.handleEdit.bind(this);
    this.changeEdit = this.changeEdit.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDeleteSkill = this.handleDeleteSkill.bind(this);
    this.handleAdditionSkill = this.handleAdditionSkill.bind(this);
    this.handleDragSkill = this.handleDragSkill.bind(this);
  }

  componentWillReceiveProps() {
    this.getUser();
  }

  componentDidMount() {
    const that = this;
    window.addEventListener("hashchange", () => {
      that.getUser();
    });
  }

  componentWillUnmount() {
    const that = this;
    window.removeEventListener("hashchange", () => {
      that.getUser();
    });
  }

  getAttendances(email) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/attendance/get/oneUserAttendances/${email}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        console.log('profile attendance success');
        this.setState({ attendances: xhr.response });
      } else {
        console.log('profile attendance fail');
        this.setState({ attendances: []});
      }
    });
    xhr.send();
  }

  getUser(email) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/user/get/profile/${email}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      //console.log(xhr.status);
      //if (xhr.status === 200) {
        const user = xhr.response;
        // Buggy and I not sure why
        user.userSkills = (xhr.response.userSkills) ? xhr.response.userSkills.map((skill, i) => {
          return {
            id: i,
            text: skill,
          };
        }) : [];
        this.setState({ user, });
      //} else {
        //console.log('profile get user fail');
        //this.setState({ user: [] });
      //}
    });
    xhr.send();
  }

  getEvent(email) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/attendance/get/oneUserEvents/${email}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      this.setState({
        events: xhr.response,
      });

      if (this.state.events) {
        this.state.events.map(event => {
          this.getExhibition(email, event.name);
        });
      }
    });
    xhr.send();
  }

  getExhibition(email, event) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/attendance/get/oneUserExhibitionsInEvent/${email}/${event}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      let exhibitionArray = this.state.exhibitions;
      xhr.response.map(event => {
        exhibitionArray.push(event);
      });

      this.setState({
        exhibitions: exhibitionArray,
      });
    });
    xhr.send();
  }


  handleDeleteSkill(i) {
    const user = this.state.user;
    user.userSkills = user.userSkills.filter((skill, index) => index !== i);

    this.setState({ user, });
  }

  handleDragSkill(skill, currPos, newPos) {
    const skills = [ ...this.state.user.userSkills ];

    // mutate array
    skills.splice(currPos, 1);
    skills.splice(newPos, 0, skill);

    // re-render
    const user = this.state.user;
    user.userSkills = skills;
    this.setState({ user, });
  }

  handleAdditionSkill(skill) {
    const user = this.state.user;
    user.userSkills = [
      ...this.state.user.userSkills,
      {
        id: this.state.user.userSkills.length + 1,
        text: skill,
      }
    ];

    this.setState({ user, });
  }

  changeEdit(event) {
    const targetId = event.target.id;
    if (targetId === 'new-user-email') {
      this.setState({
        email: event.target.value,
      });
    } else if (targetId === 'new-user-description') {
      const description = this.state.user;
      description.userDescription = event.target.value;
      this.setState({
        user: description,
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
        description: this.state.user.userDescription,
        skills: this.state.user.userSkills,
        links: this.state.links,
        interestedOpportunities: this.state.interestedOpportunities,
      },
    });
  }

  handleCancel() {
    this.setState({
      email: this.state.pastUserData.email,
      description: this.state.user.userDescription,
      skills: this.state.pastUserData.skills,
      links: this.state.pastUserData.links,
      interestedOpportunities: this.state.pastUserData.interestedOpportunities,
      isContentEditable: false,
    });
  }

  submitForm() {
    const skillArray = this.state.user.userSkills.map(skill => { return skill.text });

    const userSkills = encodeURIComponent(skillArray);
    const userDescription = encodeURIComponent(this.state.user.userDescription);
    const userEmail = encodeURIComponent(this.state.email);
    const formData = `userEmail=${userEmail}&userSkills=${userSkills}&userDescription=${userDescription}`;

    this.setUserInfo(formData, this.handleEdit());
  }

  setUserInfo(formData, callback) {
    if (this.state.user.userSkills !== this.state.pastUserData.skills) {
      const xhr = new XMLHttpRequest();
      xhr.open('post', '/user/post/profile/set/skills');
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          // success
          this.setState({
            feedback: 'Successfully edited',
          });
        } else {
          // failure
          this.setState({
            feedback: xhr.response,
          });
        }
      });
      xhr.send(formData);
    }

    if (this.state.user.userDescription !== this.state.pastUserData.description) {
      const xhr = new XMLHttpRequest();
      xhr.open('post', '/user/post/profile/set/description');
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          // success
          this.setState({
            feedback: 'Successfully edited',
          });
        } else {
          // failure
          this.setState({
            feedback: xhr.response,
          });
        }
      });
      xhr.send(formData);
    }

    callback;
  }

  addDefaultSrc(event) {
    event.target.src = "../../resources/images/empty-poster-placeholder.png";
  }

  render() {
    const userEmail = (Auth.isUserAuthenticated()) ? Auth.getToken().email.replace(/%40/i, '@') : '';

    return (
      <div id="profile-body">
      {
        (Object.keys(this.state.user).length !== 0)
        ? <div className="row justify-content-between justify-content-md-around">
            <div id="profile-picture" className="col-md-6 push-md-3 col-12 text-center">
              <img src="../../resources/images/default-profile-picture.png" alt="profile-img" />
            </div>
            <div className="col-md-3 pull-md-6 col-6 text-center d-flex justify-content-center">
            {
              (this.state.user.userEmail !== userEmail) ?
                <div id="chat-icon-container">
                  <Link to={`/chat/${this.state.user.userEmail}`}>
                    <img id="chat-icon" src="../../resources/images/chat-icon.svg" alt="chat-icon" />
                  </Link>
                </div> : <div />
            }
            </div>
            <div className="col-md-3 col-6 text-center d-flex justify-content-center" onClick={this.handleEdit}>
            {
              (this.state.user.userEmail === userEmail) ?
                <div id="edit-icon-container">
                  <img id="edit-icon" src="../../resources/images/edit-icon.svg" alt="edit-icon" />
                </div> : <div />
            }
            </div>
          </div>
        : <div id="profile-picture" className="col-12 text-center">
           <img src="../../resources/images/default-profile-picture.png" alt="profile-img" />
          </div>
       }
        <div className="profile-info card">
          <div className="card-block">
            <div className="card-text">
              <h4 id="user-name" className="card-title">{this.state.user.userName}</h4>
              <div>
                <span className="info-type">Email: </span>
                <span id="user-email" className="user-info">{this.state.user.userEmail}</span>
              </div>
              <div>
                <span className="info-type">Description: </span>
                { (this.state.isContentEditable) ?
                  <input id="new-user-description" type="text" className="form-control" value={this.state.user.userDescription} onChange={this.changeEdit} /> :
                  <span id="user-description" className="user-info">{this.state.user.userDescription}</span>
                }
              </div>
              <div>
                <span className="info-type">Skills: </span>
                { (this.state.isContentEditable) ?
                  <ReactTags
                    tags={this.state.user.userSkills}
                    suggestions={suggestions}
                    handleDelete={this.handleDeleteSkill}
                    handleAddition={this.handleAdditionSkill}
                    handleDrag={this.handleDragSkill}
                    placeholder="Add skills"
                  /> :
                  <div>
                    {
                      (Object.keys(this.state.user).length !== 0) ?
                        this.state.user.userSkills.map(skill => <span id="user-skills" className="user-info" key={`${skill.text}${skill.id}`}>{skill.text}</span>)
                        : <div />
                    }
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
          <div id="accordion" role="tablist" aria-multiselectable="true">
            <div className="card">
              <div className="card-header" role="tab" id="headingOne">
                <h5 className="mb-0">
                  <a data-toggle="collapse" data-parent="#accordion" href="#exhibition-involved" aria-expanded="true" aria-controls="collapseOne">
                    Exhibitions Involved
                  </a>
                </h5>
              </div>
              <div id="exhibition-involved" className="collapse" role="tabpanel" aria-labelledby="headingOne">
                <div className="card-block">
                  {
                    (this.state.exhibitions) ?
                    this.state.exhibitions.map(exhibition =>
                      <Link to={`/exhibition/${exhibition.eventName}/${exhibition.exhibitionName}`} key={exhibition.id}>
                        <div id="user-exhibition-container">
                          <img className="img-fluid user-page-thumbnail" src={`${exhibition.poster}`} onError={this.addDefaultSrc} alt="project-poster" />
                          <div id="user-exhibition">
                            <div>{exhibition.exhibitionName}</div>
                            <div className="tag-container">{(this.state.attendances) ? this.state.attendances.filter(
                              attendance => {if (attendance.attendanceKey === exhibition.id) return attendance;}).map(
                                attendance => attendance.reasons.map(
                                  reason => <span className="tag badge badge-pill badge-success">{reason}</span>)) :
                                  <div/>
                            }</div>
                          </div>
                        </div>
                      </Link>
                    ) : <div />
                  }
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header" role="tab" id="headingTwo">
                <h5 className="mb-0">
                  <a className="collapsed" data-toggle="collapse" data-parent="#accordion" href="#event-involved" aria-expanded="false" aria-controls="collapseTwo">
                    Events Involved
                  </a>
                </h5>
              </div>
              <div id="event-involved" className="collapse" role="tabpanel" aria-labelledby="headingTwo">
                <div className="card-block">
                  {
                    (this.state.events) ?
                    this.state.events.map(event =>
                      <Link to={`/event/${event.name}`}  key={event.id}>
                        <div id="user-event-container">
                          <img className="img-fluid user-page-thumbnail" src={`${event.event_poster}`} onError={this.addDefaultSrc} alt="event-image" />
                          <div id="user-events">
                            <div>{event.name}</div>
                            <div className="tag-container">{(this.state.attendances) ? this.state.attendances.filter(
                              attendance => {if (attendance.attendanceKey === event.id) return attendance;}).map(
                                attendance => attendance.reasons.map(
                                  reason => <span className="tag badge badge-pill badge-success">{reason}</span>)) :
                                  <div/>
                            }</div>
                          </div>
                        </div>
                      </Link>
                    ) : <div />
                  }
                </div>
              </div>
            </div>
          </div>
          { (this.state.isContentEditable) ?
            <div className="card-block text-right">
              <button className="btn btn-primary post-edit" onClick={this.submitForm}>Save</button>
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
