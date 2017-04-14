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
import { Link } from 'react-router';
import ReactSwipe from 'react-swipe';

class Match extends React.Component {
  constructor(props) {
    super(props);

    const pathname = this.props.location.pathname;
    const remaining = pathname.slice(0, pathname.lastIndexOf('/'));
    const remaining2 = remaining.slice(0, remaining.lastIndexOf('/'));
    const reasons = pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length);
    const id = remaining.slice(remaining.lastIndexOf('/') + 1, remaining.length);
    const email = remaining2.slice(remaining2.lastIndexOf('/') + 1, remaining2.length);

    this.state = {
      eventId: id,
      reasons: reasons.split(','),
      relevantUsers: [],
      email,
      userEvents: {},
    }

    this.getRelevantUsers(this.state.reasons);

    this.getEventsAndExhibitons = this.getEventsAndExhibitons.bind(this);
    this.getRelevantEventsAndExhibitions = this.getRelevantEventsAndExhibitions.bind(this);
  }

  getRelevantUsers(array) {
    const id = encodeURIComponent(this.state.eventId);
    const reasons = encodeURIComponent(array.toString());
    const formData = `id=${id}&reasons=${reasons}`;

    const xhr = new XMLHttpRequest();
    xhr.open('post', 'attendance/post/search/event/exhibitors/reasons');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const array = xhr.response.filter(user => {if (user.userEmail !== this.state.email) return user;});
        this.setState({ relevantUsers: array });
        this.getRelevantEventsAndExhibitions();
      } else {
        this.setState({ relevantUsers: [] });
      }
    });
    xhr.send(formData);
  }

  getRelevantEventsAndExhibitions() {
    for (const user of this.state.relevantUsers) {
      this.getEventsAndExhibitons(user.userEmail);
    }
  }

  /**
    * For each of the matched user, get their related events and exhibitions.
    */
  getEventsAndExhibitons(email) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/attendance/get/oneUserEventsAndExhibitions/${email}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const obj = this.state.userEvents;
        obj[`${email}`] = xhr.response;
        this.setState({userEvents: obj });
      } else {

      }
    });
    xhr.send();
  }

  next() {
    this.refs.reactSwipe.next();
  }

  prev() {
    this.refs.reactSwipe.prev();
  }

  render() {
    return(
      <ReactSwipe ref="reactSwipe" className="carousel" swipeOptions={{continuous: false}} key={this.state.relevantUsers.length}>
      {
        this.state.relevantUsers.map((user, i) =>
          <div key={i} className="d-flex align-items-center flex-column">
            <div className="match-button-lg-prev d-flex flex-column hidden-sm-down" onClick={::this.prev}>
              <img className="match-icons" src="../../resources/images/chevron-left.svg" />
              <div>Prev</div>
            </div>
            <div className="match-button-lg-next d-flex flex-column hidden-sm-down" onClick={::this.next}>
              <img className="match-icons" src="../../resources/images/chevron-right.svg" />
              <div>Next</div>
            </div>
            <div id="match-body">
              <div className="row justify-content-between justify-content-md-around">
                <div className="col-md-3 text-center d-flex justify-content-center hidden-sm-down">
                  <div id="chat-icon-container">
                    <Link to={`/chat/${user.userEmail}`}>
                      <img id="chat-icon" src="../../resources/images/chat-icon.svg" alt="chat-icon" />
                    </Link>
                  </div>
                </div>
                <div id="match-user-poster-container" className="col-12 col-md-6 text-center">
                  <img className="img-fluid user-image" src="../../resources/images/default-profile-picture.png" />
                </div>
                <div className="col-md-3 text-center d-flex justify-content-center hidden-sm-down">
                  <div id="match-icon-container">
                    <img id="match-icon" src="../../resources/images/favorite-large-icon.svg" alt="match-icon" />
                  </div>
                </div>
              </div>
              <div className="row justify-content-center">
                <h3 className="user-name user-info">{user.userName}</h3>
              </div>
              <div className="row justify-content-center">
                {
                  user.userSkills.map((skill, i) =>
                    <div className="badge badge-pill badge-info reason-tag" key={i}>{skill}</div>
                )}
              </div>
              <div className="row justify-content-center hidden-md-up">
                <button type="button" className="match-button col-4 col-md-4 btn btn-secondary" onClick={::this.prev}>
                  <img className="match-icons" src="../../resources/images/chevron-left.svg" />Prev
                </button>
                <button type="button" className="match-button col-3 col-md-3 btn btn-success">
                  <img className="match-icons" src="../../resources/images/favorite-icon.svg" />
                </button>
                <button type="button" className="match-button col-4 col-md-4 btn btn-secondary" onClick={::this.next}>
                  <img className="match-icons" src="../../resources/images/chevron-right.svg" />Next
                </button>
              </div>
              <hr className="divider" />
              <div className="more-info text-center hidden-md-up">
                <Link to={`/profile/${user.userEmail}`}>More Info</Link>
              </div>
              <div className="hidden-sm-down">
                <div className="profile-info card">
                  <div className="card-block">
                    <div className="card-text">
                      <div>
                        <strong className="info-type">Email: </strong>
                        <span id="user-email" className="user-info">{user.userEmail}</span>
                      </div>
                      <div>
                        <strong className="info-type">Description: </strong>
                        <span id="user-desc" className="user-info">{user.userDescription}</span>
                      </div>
                      <div>
                        <strong className="info-type">Links: </strong>
                        <span id="user-links" className="user-info"></span>
                      </div>
                    </div>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <div className="info-type"><strong>Lists of Projects Involved: </strong></div>
                      <div id="user-projects" className="user-info">
                        {
                          (this.state.userEvents) ?
                            Object.keys(this.state.userEvents).filter(email => {if (user.userEmail === email) return email;}).map(email =>
                              this.state.userEvents[`${email}`].map(exhibition =>
                                <div>{exhibition.exhibitionName}</div>
                              )
                            ) :
                            <div/>
                        }
                      </div>
                    </li>
                    <li className="list-group-item">
                      <div className="info-type"><strong>Interested Events: </strong></div>
                      <div id="user-events" className="user-info">
                        {
                          (this.state.userEvents) ?
                            Object.keys(this.state.userEvents).filter(email => {if (user.userEmail === email) return email;}).map(email =>
                              this.state.userEvents[`${email}`].map(event =>
                                <div>{event.name}</div>
                              )
                            ) :
                            <div/>
                        }
                      </div>
                    </li>
                    <div className="more-info text-center hidden-sm-down">
                      <Link to={`/profile/${user.userEmail}`}><strong>More Info</strong></Link>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      }
      </ReactSwipe>
    );
  }
}

Match.propTypes = {
  location: React.PropTypes.object.isRequired,
};

export default Match;
