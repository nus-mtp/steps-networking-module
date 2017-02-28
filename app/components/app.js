import React from 'react';
import { Link } from 'react-router';
import Auth from '../database/auth';
import Paths from "../paths"

class App extends React.Component {
  render() {
    return(
      <div>
        <nav className="navbar fixed-top navbar-toggleable-md navbar-light bg-faded">
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link to={Paths.home}><img id="brand-logo" src="resources/images/home.svg" alt="Home"/></Link>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link className="nav-link" to={Paths.profile}>Profile</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={Paths.event}>Event</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={Paths.chat}>Chat</Link>
              </li>
            </ul>
            <form className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" type="text" placeholder="Search" />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
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

/*
    <div id="user-authentication-buttons" className="col-8 col-md-4 text-right">
      { Auth.isUserAuthenticated() ?
        <Link to={Paths.logout}><button id="logout" type="button" className="btn btn-secondary">Logout</button></Link> :
        <div>
          <Link to={Paths.login}><button id="login" type="button" className="btn-sm btn-primary">Login</button></Link>
          <Link to={Paths.signup}><button id="signup" type="button" className="btn-sm btn-secondary">Sign Up</button></Link>
        </div>
      }
    </div>
  */
