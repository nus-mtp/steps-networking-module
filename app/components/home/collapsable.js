import React from 'react';
import { Link } from 'react-router';
import sampleUsers from '../profile/sampleUsers';

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
      users: sampleUsers,
      relevantUsers: [],
      checkbox: [],
    };

    this.initializeCheckboxes();

    this.setLayout = this.setLayout.bind(this);
    this.setPresent = this.setPresent.bind(this);
    this.setAbsent = this.setAbsent.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.getRelevantUsers = this.getRelevantUsers.bind(this);
  }

  initializeCheckboxes() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `attendance/get/oneUserAttendance/${this.props.email}/${this.props.event.id}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        console.log("Initialize Checkbox Success");
        this.setState({ checkbox: xhr.response.reasons });
        this.getRelevantUsers(xhr.response.reasons);
      } else {
        console.log("Initialize Checkbox Fail");
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

  onToggle(e) {
    if (e.target.checked) {
      const array = this.state.checkbox;
      array.push(e.target.name);
      const array2 = array.filter(box => {if (box !== 'nil') return box;});
      this.setState({ checkbox: array2 });

      const userEmail = encodeURIComponent(this.props.email);
      const id = encodeURIComponent(this.props.event.id);
      const reasons = encodeURIComponent(array2.toString());
      const formData = `userEmail=${userEmail}&id=${id}&reasons=${reasons}`;

      const xhr = new XMLHttpRequest();
      xhr.open('post', 'attendance/post/set/oneAttendanceReasons');
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          console.log('Add Event Reason Success');
        } else {
          console.log('Add Event Reason Fail');
        }
      });
      xhr.send(formData);
      this.getRelevantUsers(array2);
    } else {
      const array = this.state.checkbox.filter(box => {if (box !== e.target.name) return box;});
      if (array.length === 0) array.push('nil');
      this.setState({ checkbox: array });

      const userEmail = encodeURIComponent(this.props.email);
      const id = encodeURIComponent(this.props.event.id);
      const reasons = encodeURIComponent(array.toString());
      const formData = `userEmail=${userEmail}&id=${id}&reasons=${reasons}`;

      const xhr = new XMLHttpRequest();
      xhr.open('post', 'attendance/post/set/oneAttendanceReasons');
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          console.log('Add Event Reason Success');
        } else {
          console.log('Add Event Reason Fail');
        }
      });
      xhr.send(formData);
      this.getRelevantUsers(array);
    }
  }

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
        console.log('Finding relevant users success');
        this.setState({ relevantUsers: xhr.response });
      } else {
        console.log('Finding relevant users fail');
        this.setState({ relevantUsers: [] });
      }
    });
    xhr.send(formData);
  }

  setAbsent() {
    this.setState({
      isAttended: false,
    });
    this.props.changeAttendance(this.props.event, false);
  }

  setPresent() {
    this.setState({
      isAttended: true,
    });
    this.props.changeAttendance(this.props.event, true);
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

  render() {
    const displayCollapse = (this.props.open[this.props.serial]) ? 'collapse show' : 'collapse hide';
    const attending = (this.state.isAttended) ? 'active' : '';
    const notAttending = (!this.state.isAttended) ? 'active' : '';

    return (
      <div style={this.setLayout()} className={displayCollapse}>
        <div className="card card-block event-info-container">
          <div>
            <div id="event-description">{this.props.event.description}</div>
            <div className="btn-group attendance-indicator-container" >
              <span className="event-attendance-title">Attendance: </span>
              <label className={`btn btn-success attendance-indicator ${attending}`}>
                <input
                type="radio"
                name="option"
                id="attend-yes"
                value="Yes"
                className="custom-control-input"
                onChange={this.setPresent} />
                Yes
              </label>
              <label className={`btn btn-secondary attendance-indicator ${notAttending}`}>
                <input
                type="radio"
                name="option"
                id="attend-no"
                value="No"
                className="custom-control-input"
                onChange={this.setAbsent} />
                No
              </label>
            </div>
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
                  <nav className="nav d-flex flex-row justify-content-between">
                    <div id="match-container">
                    {
                      (this.state.relevantUsers.length !== 0) ?
                        this.state.relevantUsers.map((relevantUser, i) =>
                          <Link to={`/profile/${relevantUser.userEmail}`} key={i}>
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
                          <button id="all-projects" className="btn btn-secondary"><Link to="/match">See More</Link></button> :
                          <div/>
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
