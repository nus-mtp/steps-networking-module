import React from 'react';
import { Link } from 'react-router';
import Auth from '../database/auth';
import Paths from '../paths';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      profileActive: '',
      loginActive: '',
      eventActive: '',
      chatActive: '',
    };
    this.handleLinks = this.handleLinks.bind(this);
  }

  componentWillReceiveProps() {
    this.handleLinks();
  }

  handleLinks() {
    const baseState = {
      profileActive: '',
      loginActive: '',
      eventActive: '',
      chatActive: '',
    };

    if (this.props.location.pathname === Paths.profile) {
      baseState.profileActive = 'active';
    } else if (this.props.location.pathname === Paths.login) {
      baseState.loginActive = 'active';
    } else if (this.props.location.pathname === Paths.event) {
      baseState.eventActive = 'active';
    } else if (this.props.location.pathname === Paths.chat) {
      baseState.chatActive = 'active';
    } // Else base state is empty

    this.setState(baseState);
  }

  render() {
    return (
      <div>
        <nav id="header" className="navbar navbar-toggleable-md navbar-light fixed-top row justify-content-between navbar-collapse">
          <Link className="col-4" to={Paths.home}><img id="brand-logo" src="resources/images/home-icon.svg" alt="Home" /></Link>
          <div id="nav-links" className="col-8 col-md-8 text-right">
            <Link className={`navbar-buttons ${this.state.profileActive}`} to={Paths.profile}>Profile</Link>
            <Link className={`navbar-buttons ${this.state.eventActive}`} to={Paths.event}>Event</Link>
            <Link className={`navbar-buttons ${this.state.chatActive}`} to={Paths.chat}>Chat</Link>
            { Auth.isUserAuthenticated() ?
              <Link className={`navbar-buttons ${this.state.loginActive}`} id="logout" to={Paths.logout}>Logout</Link> :
              <Link className={`navbar-buttons ${this.state.loginActive}`}id="login" to={Paths.login}>Login</Link>
            }
          </div>
        </nav>
        <div id="app-body">
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.element.isRequired,
  location: React.PropTypes.object.isRequired,
};

export default App;
