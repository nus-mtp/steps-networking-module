import React from 'react';
import { Link } from 'react-router';
import Auth from '../database/auth';
import Paths from '../paths';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.removeDropdown = this.removeDropdown;
  }

  removeDropdown() {
    document.getElementById("navbarSupportedContent").classList.remove("show");
  }

  render() {
    return(
      <div>
        <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
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
                  <Link onClick={this.removeDropdown.bind(this)} className="link nav-link" to={Paths.profile}>Profile</Link> :
                  <Link></Link> }
              </li>
              <li className="nav-item">
                { Auth.isUserAuthenticated() ?
                  <Link onClick={this.removeDropdown.bind(this)} className="link nav-link" to={Paths.event}>Event</Link> :
                  <Link></Link> }
              </li>
              <li className="nav-item">
                { Auth.isUserAuthenticated() ?
                  <Link onClick={this.removeDropdown.bind(this)} className="link nav-link" to={Paths.chat}>Chat</Link> :
                  <Link></Link> }
              </li>
              <li className="nav-item">
                { Auth.isUserAuthenticated() ?
                  <Link onClick={this.removeDropdown.bind(this)} id="logout" className="link nav-link" to={Paths.logout}>Logout</Link> :
                  <Link onClick={this.removeDropdown.bind(this)} id="login" className="link nav-link" to={Paths.login}>Login</Link> }
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
};

export default App;
