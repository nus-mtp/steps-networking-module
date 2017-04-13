import React from 'react';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchDefaults: [],   // the field we are searching
      searchResults: [],    // the results from search term
      search: '',   // the selected search term
      searchFilter: 'Event',  // default filter
      error: '',  // error message
    }

    this.filterSearch();

    this.getSearchAsync = this.getSearchAsync.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchFilter !== this.state.searchFilter) {
      this.filterSearch();
    };
  }

  /**
    * Retrives data from database and
    * cache all event or exhibition depending on the filter
    */
  filterSearch() {
    const xhr = new XMLHttpRequest();

    // call event route
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

    // call exhibition route
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

  /**
    * Filters the cached exhibition/event/user depending on the user input
    * This is achieved by searching the cache for the if it contains the user search query
    * and renders the result as suggestions for the user
    * @param input event
    */
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

  /**
    * Handles the search by
    * redirecting to the relevant page depending on
    * the search query
    * @param search term
    */
  handleSearch(term) {
    let searchUrl = (typeof term === 'string') ? term : this.state.search;

    if (searchUrl) {
      if (this.state.searchFilter === 'Event') {
        this.context.router.push(`/event/${searchUrl}`);
      } else if (this.state.searchFilter === 'Exhibition') {
        let eventName = 'null';

        // get the eventName from the exhibition object to be used as url
        this.state.searchDefaults.map(term => {
          if (term.exhibitionName.trim().toLowerCase().search(searchUrl.trim().toLowerCase()) !== -1) {
            eventName = term.eventName;
          }
        });
        this.context.router.push(`/exhibition/${eventName}/${searchUrl}`);
      } else if (this.state.searchFilter === 'Skills') {
        this.context.router.push(`/search/user/${searchUrl.replace(/ /g, ",")}`);
      } else if (this.state.searchFilter === 'Tags') {
        this.context.router.push(`/search/exhibition/${searchUrl.replace(/ /g, ",")}`);
      }

      this.setState({
        searchResults: [],
        search: '',
        error: '',
      });
    }
    else {
      this.setState({
        searchResults: [],
        search: '',
        error: 'Search cannot be empty',
      })
    }
  }

  /**
    * Change the filter state
    * @param filter name
    */
  changeFilterInput(filter) {
    this.setState({
      searchFilter: filter,
      searchResults: [],
      search: '',
    });
  }

  render() {
    return (
      <div id="search-filter-container">
        <form className="form-inline mt-1 mt-lg-0 row" id="search-container" onSubmit={this.handleSearch}>
          <input id="search-input" className="form-control col-7 col-md-9" type="text" placeholder="Search" onChange={this.getSearchAsync} value={this.state.search} />
          <button id="search-submit" className="btn btn-secondary col-2 col-md-1" type="submit">
            <img id="search-icon" src="../resources/images/search-icon.svg" alt="chat-icon" />
          </button>
          <div className="dropdown col-md-2 col-3">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="search-filter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              {this.state.searchFilter}
            </button>
            <ul className="dropdown-menu" aria-labelledby="search-filter">
              <li className="dropdown-item" onClick={this.changeFilterInput.bind(this, "Event")}>Event</li>
              <li className="dropdown-item" onClick={this.changeFilterInput.bind(this, "Exhibition")}>Exhibition</li>
              <li className="dropdown-item" onClick={this.changeFilterInput.bind(this, "Skills")}>User Skills</li>
              <li className="dropdown-item" onClick={this.changeFilterInput.bind(this, "Tags")}>Exhibition Tags</li>
            </ul>
          </div>
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
      </div>
    );
  }
}

Search.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default Search;
