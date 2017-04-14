/*
   eslint-disable array-callback-return,
   jsx-a11y/no-static-element-interactions,
   react/jsx-no-bind,
   class-methods-use-this,
   consistent-return,
   no-param-reassign,
   react/forbid-prop-types,
*/

import React from 'react';
import Auth from '../../database/auth';
import { Link } from 'react-router';

const scrollbarWidth = 15;
const bodyMargin = 0.2 * window.innerWidth;
const marginOffset = scrollbarWidth + bodyMargin;

class Collapsable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfEventPerRow: Math.floor((window.innerWidth - marginOffset) / this.props.width),
      order: this.props.serial,
      isAttended: false,
      relevantUsers: [],
      checkbox: [],
      participating: false,
    };

    this.initializeCheckboxes();
    this.isParticipatingEvent(this.props.event.name);

    this.setLayout = this.setLayout.bind(this);
    this.setPresent = this.setPresent.bind(this);
    this.setAbsent = this.setAbsent.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.getRelevantUsers = this.getRelevantUsers.bind(this);
  }

  /**
    * Get thE state of the checkboxes from the database
    */
  initializeCheckboxes() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `attendance/get/oneUserAttendance/${this.props.email}/${this.props.event.id}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({ checkbox: xhr.response.reasons });
        this.getRelevantUsers(xhr.response.reasons);
      } else {
        this.setState({ checkbox: [] });
      }
    });
    xhr.send();
  }

  componentDidMount() {
    this.checkAttendance();
    window.addEventListener('resize', this.updateLayout, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateLayout);
  }

  /**
    * WARNING: Very math!!
    * This will make this component to have full width depending on the number of events per row
    */
  setLayout() {
    const marginToDisplay = Math.abs(this.state.order % this.state.numberOfEventPerRow);

    return {
      width: `calc(${this.state.numberOfEventPerRow}00% + ${(this.state.numberOfEventPerRow - 1) * 20}px)`,
      minWidth: '100%',
      borderTop: 'none',
      marginLeft: `calc(-${marginToDisplay}00% - ${marginToDisplay * 20}px)`,
      marginTop: '-1px',
    };
  }

  /**
    * Toggle the checkbox, send the whole array to database
    */
  onToggle(e) {
    if (e.target.checked) {
      const currentArray = this.state.checkbox;
      currentArray.push(e.target.name);
      const newArray = currentArray.filter(box => {if (box !== 'nil') return box;});
      this.setState({ checkbox: newArray });

      const userEmail = encodeURIComponent(this.props.email);
      const id = encodeURIComponent(this.props.event.id);
      const reasons = encodeURIComponent(newArray.toString());
      const formData = `userEmail=${userEmail}&id=${id}&reasons=${reasons}`;

      const xhr = new XMLHttpRequest();
      xhr.open('post', 'attendance/post/set/oneAttendanceReasons');
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Authorization', `Bearer ${JSON.stringify(Auth.getToken())}`);
      xhr.responseType = 'json';
      xhr.send(formData);
      this.getRelevantUsers(newArray); // Refreshes the user list
    } else {
      const newArray = this.state.checkbox.filter(box => {if (box !== e.target.name) return box;});
      if (newArray.length === 0) newArray.push('nil');
      this.setState({ checkbox: newArray });

      const userEmail = encodeURIComponent(this.props.email);
      const id = encodeURIComponent(this.props.event.id);
      const reasons = encodeURIComponent(newArray.toString());
      const formData = `userEmail=${userEmail}&id=${id}&reasons=${reasons}`;

      const xhr = new XMLHttpRequest();
      xhr.open('post', 'attendance/post/set/oneAttendanceReasons');
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.setRequestHeader('Authorization', `Bearer ${JSON.stringify(Auth.getToken())}`);
      xhr.responseType = 'json';
      xhr.send(formData);
      this.getRelevantUsers(newArray); // Refreshes the user list
    }
  }


  /**
    * Get the relevant users based on the checkboxes ticked
    * @param array of elements consisting of the reasons
    */
  getRelevantUsers(array) {
    const id = encodeURIComponent(this.props.event.id);
    const reasons = encodeURIComponent(array.toString());
    const formData = `id=${id}&reasons=${reasons}`;

    const xhr = new XMLHttpRequest();
    xhr.open('post', 'attendance/post/search/event/exhibitors/reasons');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const array = xhr.response.filter(user => {if (user.userEmail !== this.props.email) return user;});
        this.setState({ relevantUsers: array });
      } else {
        this.setState({ relevantUsers: [] });
      }
    });
    xhr.send(formData);
  }

  setAbsent() {
    const currentState = this.state.isAttended;
    if (currentState) {
      this.setState({
        isAttended: false,
      });
      this.props.changeAttendance(this.props.event);
    }
  }

  setPresent() {
    const currentState = this.state.isAttended;
    if (!currentState) {
      this.setState({
        isAttended: true,
      });
      this.props.changeAttendance(this.props.event);
    }
  }

  checkAttendance() {
    for (const attend of this.props.attendance) {
      if (this.props.event.id === attend.attendanceKey) {
        this.setState({
          isAttended: true,
        });
      }
    }
  }

  updateLayout() {
    this.setState({
      numberOfEventPerRow: Math.floor((window.innerWidth - marginOffset) / this.props.width),
    });
  }

  isParticipatingEvent(eventName) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/attendance/get/oneUserExhibitionsInEvent/${this.props.email}/${eventName}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({ participating: true});
      } else {
        this.setState({ participating: false});
      }
    });
    xhr.send();
  }

  render() {
    const displayCollapse = (this.props.open[this.props.serial]) ? 'collapse show' : 'collapse hide';
    const attending = (this.state.isAttended) ? 'active' : '';
    const notAttending = (!this.state.isAttended) ? 'active' : '';

    return (
      <div style={this.setLayout()} className={displayCollapse}>
        <div className="card card-block event-info-container">
          <div>
            <div id="event-description">{this.props.event.description}</div>
            <div className="btn-group attendance-indicator-container">
              <span className="event-attendance-title">Attendance: </span>
              <label className={`btn btn-secondary attendance-indicator ${attending}-yes`}>
                <input
                type="radio"
                name="option"
                id="attend-yes"
                value="Yes"
                className="custom-control-input"
                onChange={this.setPresent}
                />
                Yes
              </label>
              <label className={`btn btn-secondary attendance-indicator ${notAttending}-no`}>
                <input
                type="radio"
                name="option"
                id="attend-no"
                value="No"
                className="custom-control-input"
                onChange={this.setAbsent}
                disabled={this.state.participating}
                />
                No
              </label>
              {
                (this.state.participating) ?
                  <div className="no-change-allow-message hidden-md-down">
                    Participants are not allowed to change this option.
                  </div> :
                  <div/>
              }
            </div>
            {
              (this.state.participating) ?
                <div className="no-change-allow-message-sm hidden-lg-up">
                  Participants are not allowed to change this option.
                </div> :
                <div/>
            }
            { (this.state.isAttended) ?
              <div>
                <hr />
                <div id="event-reasons">
                  <span className="event-reason-title">Looking for people looking for: </span>
                  <label htmlFor={"fulltime-reason-" + this.props.serial} className="custom-control custom-checkbox">
                    <input id={"fulltime-reason-" + this.props.serial} type="checkbox" className="custom-control-input"
                      name="full-time" onChange={this.onToggle} checked={this.state.checkbox.includes('full-time')} />
                    <span className="custom-control-indicator" />
                    <span className="custom-control-description reasons">Full-time</span>
                  </label>
                  <label htmlFor={"intern-reason-" + this.props.serial} className="custom-control custom-checkbox">
                    <input id={"intern-reason-" + this.props.serial} type="checkbox" className="custom-control-input"
                      name="internship" onChange={this.onToggle} checked={this.state.checkbox.includes('internship')} />
                    <span className="custom-control-indicator" />
                    <span className="custom-control-description reasons">Internship</span>
                  </label>
                  <label htmlFor={"partner-reason-" + this.props.serial} className="custom-control custom-checkbox">
                    <input id={"partner-reason-" + this.props.serial} type="checkbox" className="custom-control-input"
                      name="partnership" onChange={this.onToggle} checked={this.state.checkbox.includes('partnership')} />
                    <span className="custom-control-indicator" />
                    <span className="custom-control-description reasons">Partnership</span>
                  </label>
                </div>
                <div id="event-matches">
                  <span className="event-match-title">Matches: </span>
                  <nav className="nav d-flex flex-row justify-content-between hidden-sm-down more-button">
                    <div id="match-container">
                    {
                      (this.state.relevantUsers.length !== 0) ?
                        this.state.relevantUsers.slice(0, this.state.numberOfEventPerRow).map((relevantUser, i) =>
                          <Link className="user-match" to={`/profile/${relevantUser.userEmail}`} key={i}>
                            <img className="img-fluid user-thumbnail" src="../../resources/images/default-profile-picture.png" alt="user-image" />
                            <div>{relevantUser.userName}</div>
                          </Link>
                        ) :
                      <div id="no-matches-message">No potential matches. Ticking more checkboxes can widen your search for more matching potential.</div>
                    }
                    </div>
                    <div>
                      {
                        (this.state.relevantUsers.length !== 0) ?
                          <button id="all-projects" className="btn btn-secondary"><Link to={`/match/${this.props.email}/${this.props.event.id}/${this.state.checkbox.toString()}`}>See More</Link></button> :
                          <div/>
                      }
                    </div>
                  </nav>

                  <nav className="nav d-flex flex-row hidden-md-up">
                    <div id="match-container-mini" className="justify-content-center">
                      {
                        (this.state.relevantUsers.length !== 0) ?
                          (this.state.relevantUsers.length === 1) ?
                            <button id="all-projects" className="btn btn-secondary"><Link to={`/match/${this.props.email}/${this.props.event.id}/${this.state.checkbox.toString()}`}>{"You have " + this.state.relevantUsers.length + " match!"}</Link></button> :
                              <button id="all-projects" className="btn btn-secondary"><Link to={`/match/${this.props.email}/${this.props.event.id}/${this.state.checkbox.toString()}`}>{"You have " + this.state.relevantUsers.length + " matches!"}</Link></button> :
                          <div id="no-matches-message">No potential matches.</div>
                      }
                    </div>
                  </nav>

                </div>
              </div>
              : <div />
            }
          </div>
        </div>
      </div>
    );
  }
}


Collapsable.propTypes = {
  serial: React.PropTypes.number.isRequired,
  open: React.PropTypes.arrayOf(React.PropTypes.any).isRequired,
  width: React.PropTypes.number.isRequired,
  event: React.PropTypes.objectOf(React.PropTypes.any).isRequired,
  attendance: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  changeAttendance: React.PropTypes.func.isRequired,
};

export default Collapsable;
