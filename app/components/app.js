import React from 'react';
import { Link } from 'react-router';

const App = ({ children }) => (
  <div>
    <nav id="header" className="navbar navbar-toggleable-md navbar-light fixed-top">
      <Link to="/"><img id="brand-logo" src="resources/images/home.svg" alt="Home" /></Link>
    </nav>
    <div id="app-body">
      {children}
    </div>
  </div>
);

App.propTypes = {
  children: React.PropTypes.element.isRequired,
};

export default App;
