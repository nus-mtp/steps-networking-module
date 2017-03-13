import React from 'react';
import { Link } from 'react-router';
import Auth from '../database/auth';
import Paths from '../paths';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileActive: '',
      loginActive: '',
      eventActive: '',
      chatActive: '',
    };
    this.removeDropdown = this.removeDropdown;
    this.handleLinks = this.handleLinks.bind(this);
  }

  componentWillReceiveProps() {
    this.handleLinks();
  }

  removeDropdown() {
    document.getElementById("navbarSupportedContent").classList.remove("show");
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
          <button id="hamburger-toggle" className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link onClick={this.removeDropdown} to={Paths.home}><img id="brand-logo" src="resources/images/home.svg" alt="Home"/></Link>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <form className="form-inline mt-2 mt-lg-0 row">
              <input id="search-input" className="form-control col-9" type="text" placeholder="Search" />
              <button id="search-submit" className="btn btn-secondary col-3" type="submit">Search</button>
            </form>
            <ul id="navbar-links" className="navbar-nav">
              <li className="nav-item">
                { Auth.isUserAuthenticated() ?
                  <Link onClick={this.removeDropdown.bind(this)} className={`navbar-buttons ${this.state.profileActive} to={Paths.profile}>Profile</Link> :
                  <Link></Link> }
              </li>
              <li className="nav-item">
                { Auth.isUserAuthenticated() ?
                  <Link onClick={this.removeDropdown.bind(this)} className={`navbar-buttons ${this.state.eventActive} to={Paths.event}>Event</Link> :
                  <Link></Link> }
              </li>
              <li className="nav-item">
                { Auth.isUserAuthenticated() ?
                  <Link onClick={this.removeDropdown.bind(this)} className={`navbar-buttons ${this.state.chatActive} to={Paths.chat}>Chat</Link> :
                  <Link></Link> }
              </li>
              <li className="nav-item">
                { Auth.isUserAuthenticated() ?
                  <Link onClick={this.removeDropdown.bind(this)} id="logout" className={`navbar-buttons ${this.state.logoutActive} to={Paths.logout}>Logout</Link> :
                  <Link onClick={this.removeDropdown.bind(this)} id="login" className={`navbar-buttons ${this.state.loginActive} to={Paths.login}>Login</Link> }
              </li>
            </ul>
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
