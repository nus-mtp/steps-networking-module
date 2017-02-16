import React from 'react';
import { Link } from 'react-router';
import Auth from '../database/auth';

class App extends React.Component {
  render() {
    return(
    <div>
      <nav id="header" className="navbar navbar-toggleable-md navbar-light fixed-top flex-row">
        <Link to="/"><img id="brand-logo" src="resources/images/home.svg" alt="Home"/></Link>
        <div id="user-authentication-buttons" className="justify-content-end d-flex">
          { Auth.isUserAuthenticated() ?
            <Link to="/logout"><button id="logout" type="button" className="btn btn-secondary">Logout</button></Link> :
            <div>
              <Link to="/login"><button id="login" type="button" className="btn-sm btn-primary">Login</button></Link>
              <Link to="/signup"><button id="signup" type="button" className="btn-sm btn-secondary">Sign Up</button></Link>
            </div>
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

export default App;
