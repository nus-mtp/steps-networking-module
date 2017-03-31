import React from 'react';
import { Link } from 'react-router';
import Auth from '../database/auth';
import Paths from '../paths';

class App extends React.Component {
  constructor(props) {
    super(props);

    const userEmail = (Auth.isUserAuthenticated()) ? Auth.getToken().email : '';

    this.state = {
      email: userEmail.replace(/%40/i, '@'),
      profileActive: '',
      loginActive: '',
      eventActive: '',
      chatActive: '',
      isHamburgerToggled: false,
    };

    this.removeDropdown = this.removeDropdown.bind(this);
    this.handleLinks = this.handleLinks.bind(this);
    this.shiftBody = this.shiftBody.bind(this);
  }

  componentWillReceiveProps() {
    this.handleLinks();
  }

  removeDropdown() {
    document.getElementById('navbar-supported-content').classList.remove('show');
    document.getElementById('app-body').classList.add('collapse-hide');
    document.getElementById('app-body').classList.remove('collapse-show');
    this.setState({
      isHamburgerToggled: !this.state.isHamburgerToggled,
    });
  }

  shiftBody() {
    if (!this.state.isHamburgerToggled) {
      document.getElementById('app-body').classList.remove('collapse-hide');
      document.getElementById('app-body').classList.add('collapse-show');
    } else {
      document.getElementById('app-body').classList.add('collapse-hide');
      document.getElementById('app-body').classList.remove('collapse-show');
    }
    this.setState({
      isHamburgerToggled: !this.state.isHamburgerToggled,
    });
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
    } else if (this.props.location.pathname === Paths.chat_empty) {
      baseState.chatActive = 'active';
    } // Else base state is empty

    this.setState(baseState);
  }

  render() {
    return (
      <div>
        <nav id="header" className="navbar fixed-top navbar-toggleable-md navbar-light bg-faded">
          <button id="hamburger-toggle" onClick={this.shiftBody} className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbar-supported-content" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <Link onClick={this.removeDropdown} to={Paths.home}><img id="brand-logo" src="resources/images/home-icon.svg" alt="Home" /></Link>
          <div className="collapse navbar-collapse flex-column flex-lg-row justify-content-between" id="navbar-supported-content">
            <form className="form-inline mt-2 mt-lg-0 row" id="search-container">
              <input id="search-input" className="form-control col-9" type="text" placeholder="Search" />
              <button id="search-submit" className="btn btn-secondary col-3" type="submit">Search</button>
            </form>
            <ul id="navbar-links" className="navbar-nav">
              <li className="nav-item">
                { Auth.isUserAuthenticated() ?
                  <Link onClick={this.removeDropdown} className={`navbar-buttons ${this.state.profileActive}`} to={`/profile/${this.state.email}`}>Profile</Link> :
                  <Link />
                }
              </li>
              <li className="nav-item">
                { Auth.isUserAuthenticated() ?
                  <Link onClick={this.removeDropdown.bind(this)} className={`navbar-buttons ${this.state.chatActive}`} to={Paths.chat}>Chat</Link> :
                  <Link></Link>

                }
              </li>
              <li className="nav-item">
                { Auth.isUserAuthenticated() ?
                  <Link onClick={this.removeDropdown} id="logout" className="navbar-buttons" to={Paths.logout}>Logout</Link> :
                  <Link onClick={this.removeDropdown} id="login" className={`navbar-buttons ${this.state.loginActive}`} to={Paths.login}>Login</Link>
                }
              </li>
            </ul>
          </div>
        </nav>
        <div id="app-body" className="collapse-hide">
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
