import React from 'react';
import { Link } from 'react-router';

class Collapsable extends React.Component {
  constructor(props) {
    super(props);

    let marginOffset = (window.innerWidth > 434) ? 135 : 35;

    this.state = {
      numberOfEventPerRow: Math.floor((window.innerWidth - marginOffset) / this.props.width),
      order: this.props.serial,
      isAttended: false,
    };

    this.setLayout = this.setLayout.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
    this.setPresent = this.setPresent.bind(this);
    this.setAbsent = this.setAbsent.bind(this);
  }

  componentDidMount() {
    this.checkAttendance();
    window.addEventListener('resize', this.updateLayout, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateLayout);
  }

  updateLayout() {
    let marginOffset = (window.innerWidth > 434) ? 135 : 35;

    this.setState({
      numberOfEventPerRow: Math.floor((window.innerWidth - marginOffset) / this.props.width),
    });
  }

  setLayout() {
    let marginToDisplay = Math.abs(this.state.order % this.state.numberOfEventPerRow);

    return {
      width: `${this.state.numberOfEventPerRow}00%`,
      minWidth: '100%',
      borderTop: 'none',
      marginLeft: `-${marginToDisplay}00%`,
      marginTop: '-1px',
    };
  }

  checkAttendance() {
    for (let attend of this.props.attendance) {
      if (this.props.event.name == attend.name) {
        this.setState({
          isAttended: true,
        });
      }
    }
  }

  setAbsent(e) {
    this.setState({
      isAttended: false,
    });
    this.props.changeAttendance(this.props.event.name, false);
  }

  setPresent(e) {
    this.setState({
      isAttended: true,
    });
    this.props.changeAttendance(this.props.event.name, true);
  }

  render() {
    let displayCollapse = (this.props.open[this.props.serial]) ? 'collapse show' : 'collapse hide';
    let attending = (this.state.isAttended) ? 'active' : '';
    let notAttending = (!this.state.isAttended) ? 'active' : '';

    return (
      <div style={this.setLayout()} className={displayCollapse}>
        <div className="card card-block event-info-container">
          <div>
            <div id="event-description">{this.props.event.description}</div>
            <div className="btn-group attendance-indicator-container" >
              <span className="event-attendance-title">Attendance: </span>
              <label className={`btn btn-success attendance-indicator ${attending}`}>
                <input type="radio" name="option" id="attend-yes" value="Yes"
                className="custom-control-input"
                onChange={this.setPresent} />
                Yes
              </label>
              <label className={`btn btn-secondary attendance-indicator ${notAttending}`}>
                <input type="radio" name="option" id="attend-no" value="No"
                className="custom-control-input"
                onChange={this.setAbsent} />
                No
              </label>
            </div>
            <div id="event-matches">
              <span className="event-match-title">Matches: </span>
              <nav className="nav">
                <Link className="nav-link matches" to="/project">Project1</Link>
                <Link className="nav-link matches" to="/project">Project2</Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


Collapsable.propTypes = {
  serial: React.PropTypes.number.isRequired,
  open: React.PropTypes.array.isRequired,
  openCollapsable: React.PropTypes.func.isRequired,
  width: React.PropTypes.number.isRequired,
  event: React.PropTypes.object,
  attendance: React.PropTypes.array,
  //changeAttendance: React.PropTypes.element,
};

export default Collapsable;
