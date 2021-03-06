/*
  eslint-disable react/forbid-prop-types,
*/

import React from 'react';
import { Link } from 'react-router';
import SearchInput from './search/searchInputView';
import Auth from '../database/auth';
import Paths from '../paths';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      profileActive: '',
      loginActive: '',
      signupActive: '',
      chatActive: '',
      isHamburgerToggled: false,
    };

    this.removeDropdown = this.removeDropdown.bind(this);
    this.handleLinks = this.handleLinks.bind(this);
    this.shiftBody = this.shiftBody.bind(this);
  }

  componentDidMount() {
    const that = this;
    this.handleLinks();
    that.getUser();
    window.addEventListener('hashchange', () => {
      that.handleLinks();
      that.getUser();
    });
  }

  componentWillUnmount() {
    const that = this;
    window.removeEventListener('hashchange', () => {
      that.handleLinks();
      that.getUser();
    });
  }

  getUser() {
    const userEmail = (Auth.isUserAuthenticated()) ? Auth.getToken().email : '';
    this.setState({
      email: userEmail.replace(/%40/i, '@'),
    });
  }

  removeDropdown() {
    document.getElementById('navbar-supported-content').classList.remove('show');
    document.getElementById('app-body').classList.add('collapse-hide');
    document.getElementById('app-body').classList.remove('collapse-show');
    this.setState({
      isHamburgerToggled: !this.state.isHamburgerToggled,
    });
  }

  /**
    * Shifts the application body when the dropdown is clicked on in mobile platforms
    */
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

  /**
    * Highlights the current page the user is at
    */
  handleLinks() {
    const baseState = {
      profileActive: '',
      loginActive: '',
      signupActive: '',
      chatActive: '',
    };

    const currentPath = this.props.location.pathname.slice(0, this.props.location.pathname.lastIndexOf('/'));

    if (currentPath === Paths.profile_empty) {
      baseState.profileActive = 'active';
    } else if (this.props.location.pathname === Paths.login) {
      baseState.loginActive = 'active';
    } else if (this.props.location.pathname === Paths.signup) {
      baseState.signupActive = 'active';
    } else if (currentPath === Paths.chat || this.props.location.pathname === Paths.chat_empty) {
      baseState.chatActive = 'active';
    } // Else base state is empty

    this.setState(baseState);
  }

  render() {
    return (
      <div>
        <nav id="header" className="navbar fixed-top navbar-toggleable-md navbar-light bg-faded">
          { (Auth.isUserAuthenticated()) ?
            <div className="application-nav d-md-flex">
              <button id="hamburger-toggle" onClick={this.shiftBody} className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbar-supported-content" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon" />
              </button>
              <Link onClick={this.removeDropdown} to={Paths.home}><img id="brand-logo" src="../resources/images/logo.png" alt="Home" /></Link>
              <div className="collapse navbar-collapse flex-column flex-lg-row justify-content-between" id="navbar-supported-content">
                <div className="hidden-lg-up responsive-container"><SearchInput /></div>
                <div className="hidden-md-down responsive-container">
                  {
                    (this.props.location.pathname === '/') ? <div /> : <SearchInput />
                  }
                </div>
                <ul id="navbar-links" className="navbar-nav">
                  {
                    Auth.isUserAuthenticated() ?
                      <li className="nav-item">
                        <Link onClick={this.removeDropdown} className={`navbar-buttons ${this.state.profileActive}`} to={`/profile/${this.state.email}`}>Profile</Link>
                      </li> : <div />
                  }
                  <li className="nav-item">
                    { Auth.isUserAuthenticated() ?
                      <Link onClick={this.removeDropdown} className={`navbar-buttons ${this.state.chatActive}`} to={Paths.chat_empty}>Chat</Link> :
                      <Link onClick={this.removeDropdown} to={Paths.signup} className={`navbar-buttons ${this.state.signupActive}`}>Signup</Link>

                    }
                  </li>
                  <li className="nav-item">
                    { Auth.isUserAuthenticated() ?
                      <Link onClick={this.removeDropdown} className="navbar-buttons" to={Paths.logout}>Logout</Link> :
                      <Link onClick={this.removeDropdown} className={`navbar-buttons ${this.state.loginActive}`} to={Paths.login}>Login</Link>
                    }
                  </li>
                </ul>
              </div>
            </div> :
            <div className="application-nav d-flex justify-content-between">
              <span id="application-title">STePS Networking Module</span>
              {
                (this.state.loginActive || this.props.location.pathname === Paths.logout) ?
                  <Link className="navbar-buttons register-btn" to={Paths.signup} >Signup</Link> :
                  <Link className="navbar-buttons register-btn" to={Paths.login}>Login</Link>
              }
            </div>
          }
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
