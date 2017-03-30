import React from 'react';

class SearchView extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="search-body">
        <h4 id="search-term"></h4>
        <div id="search-results" className="card">
            <div className="card-block">
            <h4 className="card-title">Card title</h4>
            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the cards content.</p>
            <a href="#" className="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      </div>
    )
  }
}

export default SearchView;
