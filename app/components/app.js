import React from 'react';
import { Link } from 'react-router';
import Auth from '../database/auth';
import Paths from '../paths';
import Bootstrap from '../../node_modules/bootstrap/dist/js/bootstrap';

class App extends React.Component {
  render() {
    return(
      <div>
        <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
          <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <Link to={Paths.home}><img id="brand-logo" src="resources/images/home.svg" alt="Home"/></Link>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <form className="form-inline my-2 my-lg-0">
              <input className="form-control mr-sm-2" type="text" placeholder="Search" />
              <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
            </form>
            <ul className="navbar-nav">
              <li className="nav-item">
                { Auth.isUserAuthenticated() ?
                  <Link className="link nav-link" to={Paths.profile}>Profile</Link> :
                  <Link></Link> }
              </li>
              <li className="nav-item">
                { Auth.isUserAuthenticated() ?
                  <Link className="link nav-link" to={Paths.event}>Event</Link> :
                  <Link></Link> }
              </li>
              <li className="nav-item">
                { Auth.isUserAuthenticated() ?
                  <Link className="link nav-link" to={Paths.chat}>Chat</Link> :
                  <Link></Link> }

              </li>
              <li className="nav-item">
                { Auth.isUserAuthenticated() ?
                  <Link id="logout" className="link nav-link" to={Paths.logout}>Logout</Link> :
                  <Link id="login" className="link nav-link" to={Paths.login}>Login</Link> }
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
