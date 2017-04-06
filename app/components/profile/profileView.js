import React from 'react';
import Paths from '../../paths';
import Auth from '../../database/auth';
import { skillSuggestions } from '../../database/suggestions';
import { Link } from 'react-router';
import { WithContext as ReactTags } from 'react-tag-input';

class ProfileView extends React.Component {
  constructor(props) {
    super(props);

    const pathname = this.props.location.pathname;
    const userEmail = pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length);

    this.state = {
      interestedOpportunities: '-', // What am I looking for
      isContentEditable: false, //  Edit mode
      descriptionCache: '',
      skillsCache: '',
      user: {},
      email: userEmail,
      events: [], // List of event user attended
      exhibitions: [], // List of exhibition user participated
      attendances: [], // For all the attendance objects
      feedback: '',  // notification for HTTP POST
      error: '',
    };

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
    this.saveReasons = this.saveReasons.bind(this);
    this.getAttendances = this.getAttendances.bind(this);
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
        this.setState({ attendances: xhr.response, });
      } else {
        this.setState({ attendances: [], });
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
      const user = xhr.response;
        if (user) {
          user.userSkills = (xhr.response && xhr.response.userSkills.length > 0) ? xhr.response.userSkills.map((skill, i) => {
          return {
            id: i,
            text: skill,
          };
        }) : [];
        this.setState({ user, });
      }
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

      if (xhr.response) {
        xhr.response.map(event => {
          exhibitionArray.push(event);
        });
      }

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
    if (targetId === 'new-user-description') {
      const user = this.state.user;
      user.userDescription = event.target.value;
      this.setState({
        user,
      });
    }
  }

  handleEdit() {
    this.setState({
      isContentEditable: !this.state.isContentEditable,
      descriptionCache: this.state.user.userDescription,
      skillsCache: this.state.user.userSkills,
    });
  }

  handleCancel() {
    const user = this.state.user;
    user.userDescription = this.state.pastUserData.userDescription;
    user.skills = this.state.pastUserData.userSkills;

    this.setState({
      user,
      interestedOpportunities: this.state.pastUserData.interestedOpportunities,
      isContentEditable: false,
    });
  }

  submitForm() {
    const skillArray = this.state.user.userSkills.map(skill => { return skill.text });

    const userSkills = encodeURIComponent(skillArray);
    const userDescription = encodeURIComponent(this.state.user.userDescription);
    const userEmail = encodeURIComponent(this.state.user.userEmail);
    const formData = `userEmail=${userEmail}&userSkills=${userSkills}&userDescription=${userDescription}`;

    this.setUserInfo(formData);
  }

  saveReasons(clsName, ExhibitionId) {
    const array = document.getElementsByClassName(clsName);
    let reasons = new Array();
    let i;
    for (i = 0; i < array.length; i += 1) {
      if (array[i].checked) {
        reasons.push(array[i].name);
      }
    }
    if (reasons.length === 0) reasons.push("No Reason");

    const userEmail = encodeURIComponent(this.state.email);
    const id = encodeURIComponent(ExhibitionId);
    const reason = encodeURIComponent(reasons.toString());
    const formData = `userEmail=${userEmail}&id=${id}&reasons=${reason}`;

    const xhr = new XMLHttpRequest();
    xhr.open('post', `attendance/post/set/oneAttendanceReasons`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', `Bearer ${JSON.stringify(Auth.getToken())}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({
          feedback: 'Reasons saved',
          error: '',
        });
      } else {
        this.setState({
          feedback: '',
          error: xhr.response,
        });
      }
    });
    xhr.send(formData);
    this.getAttendances(userEmail);
  }

  setUserInfo(formData) {
    if (this.state.user.userSkills !== this.state.skillsCache) {
      const xhr = new XMLHttpRequest();
      xhr.open('post', '/user/post/profile/set/skills');
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Authorization', `Bearer ${JSON.stringify(Auth.getToken())}`);
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          // success
          this.setState({
            feedback: 'Successfully edited',
            error: '',
            isContentEditable: !this.state.isContentEditable,
          });
        } else {
          // failure
          this.setState({
            feedback: '',
            error: xhr.response,
            isContentEditable: !this.state.isContentEditable,
          });
        }
      });
      xhr.send(formData);
    }

    if (this.state.user.userDescription !== this.state.descriptionCache) {
      const xhr = new XMLHttpRequest();
      xhr.open('post', '/user/post/profile/set/description');
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Authorization', `Bearer ${JSON.stringify(Auth.getToken())}`);
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          // success
          this.setState({
            feedback: 'Successfully edited',
            isContentEditable: !this.state.isContentEditable,
          });
        } else {
          // failure
          this.setState({
            feedback: xhr.response,
            isContentEditable: !this.state.isContentEditable,
          });
        }
      });
      xhr.send(formData);
    }
  }

  addDefaultSrc(event) {
    event.target.src = "../../resources/images/empty-poster-placeholder.png";
  }

  render() {
    const userEmail = (Auth.isUserAuthenticated()) ? Auth.getToken().email.replace(/%40/i, '@') : '';
    const isNotify = (this.state.error || this.state.feedback) ? ((this.state.feedback) ?
      <div className="alert alert-success" role="alert">
        <strong>Success!</strong> {this.state.feedback}
      </div> :
      <div className="alert alert-danger" role="alert">
        <strong>Error!</strong> {this.state.error}
      </div>) : <div />;

    return (
      <div id="profile-body">
        {isNotify}
        {
          (Object.keys(this.state.user).length !== 0)
          ? <div className="row justify-content-between justify-content-md-around">
              <h4 id="user-name" className="col-md-6 push-md-3 col-12 text-center align-self-center">{this.state.user.userName}</h4>
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
          : <div />
         }
        <div className="profile-info card">
          <div className="card-block">
            <div className="card-text">
              <div>
                <span className="info-type">Email: </span>
                <span id="user-email" className="user-info">{this.state.user.userEmail}</span>
              </div>
              <div>
                <span className="info-type">Description: </span>
                {
                  (this.state.isContentEditable) ?
                  <input id="new-user-description" type="text" className="form-control" value={this.state.user.userDescription} onChange={this.changeEdit} /> :
                  <span id="user-description" className="user-info">{this.state.user.userDescription}</span>
                }
              </div>
              <div>
                <span className="info-type">Skills: </span>
                {
                  (this.state.isContentEditable) ?
                  <ReactTags
                    tags={this.state.user.userSkills}
                    suggestions={skillSuggestions}
                    handleDelete={this.handleDeleteSkill}
                    handleAddition={this.handleAdditionSkill}
                    handleDrag={this.handleDragSkill}
                    placeholder="Add skills"
                    allowDeleteFromEmptyInput={false}
                    handleInputBlur={this.handleInputBlur}
                    autofocus={false}
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
            </div>
          </div>
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
                    this.state.exhibitions.map((exhibition, i) =>
                      <div key={i}>
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
                        <div>
                          {
                            (this.state.isContentEditable) ?
                              <div id="event-reasons">
                                <span className="event-reason-title">Looking for: </span>
                                <label htmlFor={"fulltime-"+i} className="custom-control custom-checkbox">
                                  <input id={"fulltime-"+i} type="checkbox" className={"custom-control-input tag-selection-row-"+i} name="Full-Time" defaultChecked={this.state.attendances.filter(
                                      attendance => {if (attendance.attendanceKey === exhibition.id)
                                        return attendance;})[0].reasons.includes('full-time')} />
                                  <span className="custom-control-indicator" />
                                  <span className="custom-control-description reasons">Full-time</span>
                                </label>
                                <label htmlFor={"internship-"+i} className="custom-control custom-checkbox">
                                  <input id={"internship-"+i} type="checkbox" className={"custom-control-input tag-selection-row-"+i} name="Internship" defaultChecked={this.state.attendances.filter(
                                      attendance => {if (attendance.attendanceKey === exhibition.id)
                                        return attendance;})[0].reasons.includes('internship')} />
                                  <span className="custom-control-indicator" />
                                  <span className="custom-control-description reasons">Internship</span>
                                </label>
                                <label htmlFor={"partnership-"+i} className="custom-control custom-checkbox">
                                  <input id={"partnership-"+i} type="checkbox" className={"custom-control-input tag-selection-row-"+i} name="Partnership" defaultChecked={this.state.attendances.filter(
                                      attendance => {if (attendance.attendanceKey === exhibition.id)
                                        return attendance;})[0].reasons.includes('partnership')} />
                                  <span className="custom-control-indicator" />
                                  <span className="custom-control-description reasons">Partnership</span>
                                </label>
                                <button className="btn btn-primary post-edit" onClick={this.saveReasons.bind(this, "tag-selection-row-"+i, exhibition.id)}>Save Selection</button>
                              </div> :
                              <div/>
                          }
                        </div>
                      </div>
                    )
                     : <div />
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
                  <div id="cannot-edit-reason">
                    {
                      (this.state.isContentEditable && this.state.events) ?
                      <h4 id="cannot-edit-message">You can edit your attendance reason in the homepage</h4> :
                      <div />
                    }
                  </div>
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
