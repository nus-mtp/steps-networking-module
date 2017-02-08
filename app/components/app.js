import React from 'react';
import { Link } from 'react-router'

class App extends React.Component {
  render() {
    return(
    <div>
      <nav id="header" className="navbar navbar-toggleable-md navbar-light fixed-top">
        <Link to="/"><img id="brand-logo" src="resources/images/home.svg" alt="Home"/></Link>
      </nav>
      <div id="app-body">
        {this.props.children}
      </div>
    </div>
    );
  }
}

export default App;
