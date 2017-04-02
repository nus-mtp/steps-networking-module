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
    };

    this.setLayout = this.setLayout.bind(this);
    this.setPresent = this.setPresent.bind(this);
    this.setAbsent = this.setAbsent.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
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
                  <span className="event-reason-title">Reason: </span>
                  <label htmlFor={"fulltime-reason-" + this.props.serial} className="custom-control custom-checkbox">
                    <input id={"fulltime-reason-" + this.props.serial} type="checkbox" className="custom-control-input" />
                    <span className="custom-control-indicator" />
                    <span className="custom-control-description reasons">Full-time</span>
                  </label>
                  <label htmlFor={"intern-reason-" + this.props.serial} className="custom-control custom-checkbox">
                    <input id={"intern-reason-" + this.props.serial} type="checkbox" className="custom-control-input" />
                    <span className="custom-control-indicator" />
                    <span className="custom-control-description reasons">Internship</span>
                  </label>
                  <label htmlFor={"partner-reason-" + this.props.serial} className="custom-control custom-checkbox">
                    <input id={"partner-reason-" + this.props.serial} type="checkbox" className="custom-control-input" />
                    <span className="custom-control-indicator" />
                    <span className="custom-control-description reasons">Partnership</span>
                  </label>
                </div>
                <div id="event-matches">
                  <span className="event-match-title">Matches: </span>
                  <nav className="nav d-flex flex-row justify-content-between">
                    <div id="match-container">
                    {
                      this.state.users.map((users, i) =>
                        <Link key={i} className="nav-link matches" to="/match">
                          <img className="img-fluid user-thumbnail" src="../../resources/images/default-profile-picture.png" alt="user-image" />
                          <div>{users.name}</div>
                        </Link>
                    )}
                    </div>
                    <button id="all-projects" className="btn btn-secondary"><Link to="/match">See More</Link></button>
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
