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
      searchDefaults: [],   // the field we are searching
      searchResults: [],    // the results from search term
      search: '',   // the selected search term
      searchFilter: 'Event',
    };

    this.filterSearch();

    this.removeDropdown = this.removeDropdown.bind(this);
    this.handleLinks = this.handleLinks.bind(this);
    this.shiftBody = this.shiftBody.bind(this);
    this.getSearchAsync = this.getSearchAsync.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentWillReceiveProps() {
    this.handleLinks();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchFilter !== this.state.searchFilter) {
      this.filterSearch();
    };
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
    } else if (this.props.location.pathname === Paths.chat) {
      baseState.chatActive = 'active';
    } // Else base state is empty

    this.setState(baseState);
  }

  filterSearch() {
    const xhr = new XMLHttpRequest();
    if (this.state.searchFilter === 'Event') {
      xhr.open('get', `/event/get/allEvents`);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        this.setState({
          searchDefaults: xhr.response,
        });
      });
      xhr.send();
    } else if (this.state.searchFilter === 'Exhibition') {
      xhr.open('get', `/exhibition/get/allExhibitions`);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        this.setState({
          searchDefaults: xhr.response,
        });
      });
      xhr.send();
    }
  }

  getSearchAsync(event) {
    const searchArray = [];
    if (event.target.value && event.target.value.length > 1) {
      this.state.searchDefaults.map(term => {
        if (term.name && term.name.trim().toLowerCase().search(event.target.value.trim().toLowerCase()) !== -1) {
          searchArray.push(term.name);
        }

        if (term.exhibitionName && term.exhibitionName.trim().toLowerCase().search(event.target.value.trim().toLowerCase()) !== -1) {
          searchArray.push(term.exhibitionName);
        }
      });

      this.setState({
        searchResults: searchArray,
      });
    } else {
      this.setState({
        searchResults: [],
      });
    }

    this.setState({
      search: event.target.value,
    });
  }

  handleSearch(term) {
    console.log(this.state.search + '....' + term);
    let searchUrl = (typeof term === 'string') ? term : this.state.search.replace(/ /g, ",");

    if (this.state.searchFilter === 'Event') {
      this.context.router.push(`/event/${searchUrl}`);
    } else if (this.state.searchFilter === 'Exhibition') {
      let eventName = '';
      this.state.searchDefaults.map(term => {
        if (term.exhibitionName.trim().toLowerCase().search(searchUrl.trim().toLowerCase()) !== -1) {
          eventName = term.eventName;
        }
      });
      this.context.router.push(`/exhibition/${eventName}/${searchUrl}`);
    } else if (this.state.searchFilter === 'Skills') {
      this.context.router.push(`/search/user/${searchUrl}`);
    } else if (this.state.searchFilter === 'Tags') {
      this.context.router.push(`/search/exhibition/${searchUrl}`);
    }

    this.setState({
      searchResults: [],
      search: '',
    });
  }

  changeFilterInput(filter) {
    this.setState({
      searchFilter: filter,
      searchResults: [],
      search: '',
    });
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
            <form className="form-inline mt-2 mt-lg-0 row" id="search-container" onSubmit={this.handleSearch}>
              <div className="dropdown col-md-3 col-4">
                <button className="btn btn-success dropdown-toggle" type="button" id="search-filter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {this.state.searchFilter}
                </button>
                <ul className="dropdown-menu" aria-labelledby="search-filter">
                  <li className="dropdown-item" onClick={this.changeFilterInput.bind(this, "Event")}>Event</li>
                  <li className="dropdown-item" onClick={this.changeFilterInput.bind(this, "Exhibition")}>Exhibition</li>
                  <li className="dropdown-item" onClick={this.changeFilterInput.bind(this, "Skills")}>User Skills</li>
                  <li className="dropdown-item" onClick={this.changeFilterInput.bind(this, "Tags")}>Exhibition Tags</li>
                </ul>
              </div>
              <input id="search-input" className="form-control col-6 col-md-7" type="text" placeholder="Search" onChange={this.getSearchAsync} value={this.state.search} />
              <button id="search-submit" className="btn btn-secondary col-2" type="submit">
                <img id="search-icon" src="../resources/images/search-icon.svg" alt="chat-icon" />
              </button>
            </form>
            <ul id="search-results" className="list-group hidden-md-down">
              {
                (this.state.searchResults) ?
                  this.state.searchResults.map(term =>
                    <li key={term.toString()} className="list-group-item" onClick={this.handleSearch.bind(this, term)}>{term}</li>
                  ) :
                  <div />
              }
            </ul>
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

App.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default App;
