import React from 'react';
import { Link } from 'react-router';

class SearchView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchResults: [],
      searchTerm: '',
      searchCategory: '',
      errors: '',
    };

    let pathname = this.props.location.pathname;
    const tags = pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length);
    pathname = pathname.slice(0, pathname.lastIndexOf('/'));
    const category = pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length);

    if (category === 'user') {
      this.getUsers(tags);
    } else if (category === 'exhibition') {
      this.getExhibitions(tags);
    } else {

    }
  }

  getExhibitions(formData) {
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/exhibition/post/search/tags');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success
        console.log(xhr.response);

        // change the component-container state
        this.setState({
          searchTerm: formData,
          searchCategory: 'exhibition',
          searchResults: xhr.response,
          errors: '',
        });
      } else {
        this.setState({
          searchTerm: formData,
          searchResults: [],
          errors: 'Not found!'
        });
        console.log(xhr.response);
      }
    });
    xhr.send(`tags=${formData}`);
  }

  getUsers(formData) {
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/user/post/search/skills');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success
        console.log(xhr.response);

        // change the component-container state
        this.setState({
          searchTerm: formData,
          searchCategory: 'user',
          searchResults: xhr.response,
          errors: '',
        });
      } else {
        this.setState({
          searchTerm: formData,
          searchResults: [],
          errors: 'Not found!'
        });
          console.log(xhr.response);
      }
    });
    xhr.send(`userSkills=${formData}`);
  }

  addDefaultSrc(event) {
    event.target.src = "../../resources/images/empty-poster-placeholder.png";
  }

  render() {
    let render = <div />;
    console.log(this.state.errors);

    if (this.state.searchResults) {
      if (this.state.searchCategory === 'exhibition') {
        render = this.state.searchResults.map(result =>
          <div id="search-result" className="card" key={result.id}>
            <img className="card-img-top card-image align-self-center" src={result.poster} onError={this.addDefaultSrc} alt="poster" />
            <div className="card-block">
              <h4 className="card-title">{result.exhibitionName}</h4>
              <div className="card-text">Event: {result.eventName}</div>
              <div className="card-text">Tags:
                {
                  result.tags.map(tag =>
                    <span className="badge badge-pill badge-success" key={tag}>{tag}</span>
                )}
              </div>
            </div>
          </div>
        );
      } else if (this.state.searchCategory === 'user') {
        render = this.state.searchResults.map(result =>
          <div id="search-result" className="card" key={result.id}>
            <img className="card-img-top card-image align-self-center" src={result.userProfilePicture} onError={this.addDefaultSrc} alt="profile picture" />
            <div className="card-block">
              <h4 className="card-title">{result.userName}</h4>
              <div className="card-text">Email: {result.userEmail}</div>
              <div className="card-text">Skills:
                {
                  result.userSkills.map(skill =>
                    <span className="badge badge-pill badge-success" key={skill}>{skill}</span>
                )}
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <div id="search-body" className="text-center">
        <h4 id="search-term">Search: <span className="badge badge-info">{this.state.searchTerm}</span></h4>
        {
          (this.state.errors) ? this.state.errors : <div />
        }
        <div className="d-flex flex-row flex-wrap justify-content-around">
          {render}
        </div>
      </div>
    )
  }
}

export default SearchView;
