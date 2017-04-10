import React from 'react';
import Search from './search/search';
import { Link } from 'react-router';
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
      isRenderSeach: true,
    };

    this.removeDropdown = this.removeDropdown.bind(this);
    this.handleLinks = this.handleLinks.bind(this);
    this.shiftBody = this.shiftBody.bind(this);
  }

  componentDidMount() {
    const that = this;
    this.handleLinks();
    that.getUser();
    window.addEventListener("hashchange", () => {
      that.handleLinks();
      that.getUser();
    });
  }

  componentWillUnmount() {
    const that = this;
    window.removeEventListener("hashchange", () => {
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

  checkRenderSearch() {
    if(this.props.location.pathname === Paths.home || this.props.location.pathname === Paths.login ||
      this.props.location.pathname === Paths.signup || this.props.location.pathname === Paths.logout) {
        this.setState({
          isRenderSeach: false,
        });
      } else {
        this.setState({
          isRenderSeach: true,
        });
      }
  }

  render() {
    this.checkRenderSearch();

    return (
      <div>
        <nav id="header" className="navbar fixed-top navbar-toggleable-md navbar-light bg-faded">
          <button id="hamburger-toggle" onClick={this.shiftBody} className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbar-supported-content" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <Link onClick={this.removeDropdown} to={Paths.home}><img id="brand-logo" src="../resources/images/home-icon.svg" alt="Home" /></Link>
          <div className="collapse navbar-collapse flex-column flex-lg-row justify-content-between" id="navbar-supported-content">
            <div className="hidden-lg-up responsive-container"><Search /></div>
            <div className="hidden-md-down responsive-container">
            {
              (this.state.isRenderSeach)
                ? <Search /> : <div />
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
                  <Link onClick={this.removeDropdown.bind(this)} className={`navbar-buttons ${this.state.chatActive}`} to={Paths.chat_empty}>Chat</Link> :
                  <Link onClick={this.removeDropdown} to={Paths.signup} id="signup" className={`navbar-buttons ${this.state.signupActive}`}>Signup</Link>

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
