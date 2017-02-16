import React from 'react';
import { Link } from 'react-router';
import Auth from '../database/auth';

class App extends React.Component {
  render() {
    return(
    <div>
      <nav id="header" className="navbar navbar-toggleable-md navbar-light fixed-top flex-row">
        <Link to="/"><img id="brand-logo" src="resources/images/home.svg" alt="Home"/></Link>
        <div id="user-authentication">
          { Auth.isUserAuthenticated() ?
            <Link to="/logout">Log out</Link> : <div><Link to="/login">Log in</Link><Link to="/signup">Sign Up</Link></div>
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
