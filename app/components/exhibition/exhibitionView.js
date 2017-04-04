import React from 'react';
import Auth from '../../database/auth';
import { Link } from 'react-router';

class ExhibitionView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentComment: '',
      comments: [],
      isTagEditable: false,
      isMediaEditable: false,
      tags: [],
      media: [],
      tagChange: '',
      mediaChange: '',
      exhibition: {},
      attendance: {},
      feedback: '',
      error: '',
    };

    this.retrieveData();

    this.editComment = this.editComment.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.toggleTagEditable = this.toggleTagEditable.bind(this);
    this.toggleMediaEditable = this.toggleMediaEditable.bind(this);
    this.handleAddTags = this.handleAddTags.bind(this);
    this.handleAddMedia = this.handleAddMedia.bind(this);
    this.handleTagInputChange = this.handleTagInputChange.bind(this);
    this.handleMediaInputChange = this.handleMediaInputChange.bind(this);
  }

  componentDidMount() {
    const that = this;
    window.addEventListener("hashchange", () => {
      that.retrieveData();
    });
  }

  componentWillUnmount() {
    const that = this;
    window.removeEventListener("hashchange", () => {
      that.retrieveData();
    });
  }

  /**
    * Function that contains all HTTP GET interactions with database
    */
  retrieveData() {
    let pathname = this.props.location.pathname;
    const exhibitionName = pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length);

    pathname = pathname.slice(0, pathname.lastIndexOf('/'));
    const eventName = pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length);

    this.getExhibition(eventName, exhibitionName);
    this.getComments(eventName, exhibitionName);
    this.getAttendance(eventName, exhibitionName);
  }

  getExhibition(event, exhibition) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/exhibition/get/oneExhibition/${event}/${exhibition}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({
          exhibition: xhr.response,
        });
      } else {
        this.setState({
          exhibition: {},
        });
      }
    });
    xhr.send();
  }

  getComments(event, exhibition) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/comment/get/${event}/${exhibition}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      this.setState({
        comments: xhr.response,
      });
    });
    xhr.send();
  }

  getAttendance(event, exhibition) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/attendance/get/oneExhibitionExhibitors/${event}/${exhibition}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({
          attendance: xhr.response,
        });
      } else {
        this.setState({
          attendance: {},
        });
      }
    });
    xhr.send();
  }

  editComment(event) {
    this.setState({
      currentComment: event.target.value,
    });
  }

  /**
    * Function to post a save a comment into the database
    * HTTP POST body requires eventName, exhibitionName, userEmail and comment
    */
  submitComment() {
    const comment = encodeURIComponent(this.state.currentComment);
    const eventName = encodeURIComponent(this.state.exhibition.eventName);
    const exhibitionName = encodeURIComponent(this.state.exhibition.exhibitionName);
    const userEmail = (Auth.isUserAuthenticated()) ? encodeURIComponent(Auth.getToken().email.replace(/%40/i, '@')) : '';
    const formData = `userEmail=${userEmail}&eventName=${eventName}&exhibitionName=${exhibitionName}&comment=${comment}`;

    const isNewComment = this.state.comments.filter(commentObject => {
        return commentObject.userEmail === Auth.getToken().email.replace(/%40/i, '@');
    });

    if (isNewComment.length > 0) {
      const xhr = new XMLHttpRequest();
      xhr.open('post', '/comment/post/addComment');
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          // success
          this.setState({
            feedback: 'Comment added',
            currentComment: '',
          });

          this.retrieveData();
        } else {
          // failure
          this.setState({
            error: xhr.response,
            currentComment: '',
          });
        }
      });
      xhr.send(formData);
    } else {
      const xhr = new XMLHttpRequest();
      xhr.open('post', '/comment/post/newComment');
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          // success
          this.setState({
            feedback: 'New comment created',
            currentComment: '',
          });

          this.retrieveData();
        } else {
          // failure
          this.setState({
            error: xhr.response,
            currentComment: '',
          });
        }
      });
      xhr.send(formData);
    }
  }

  toggleTagEditable() {
    this.setState({
      isTagEditable: !this.state.isTagEditable,
    });
  }

  toggleMediaEditable() {
    this.setState({
      isMediaEditable: !this.state.isMediaEditable,
    });
  }

  handleAddTags() {
    const newTags = this.state.tags;
    newTags.push(this.state.tagChange);
    this.setState({
      tags: newTags,
    });
  }

  handleAddMedia() {
    const newMedia = this.state.media;
    newMedia.push(this.state.mediaChange);
    this.setState({
      media: newMedia,
    });
  }

  handleTagInputChange(event) {
    this.setState({
      tagChange: event.target.value,
    });
  }

  handleMediaInputChange(event) {
    this.setState({
      mediaChange: event.target.value,
    });
  }

  addDefaultSrc(event) {
    event.target.src = "../../resources/images/empty-poster-placeholder.png";
  }

  render() {
    const isNotify = (this.state.error || this.state.feedback) ? ((this.state.feedback) ?
      <div className="alert alert-success" role="alert">
        <strong>Success!</strong> {this.state.feedback}
      </div> :
      <div className="alert alert-danger" role="alert">
        <strong>Error!</strong> {this.state.error}
      </div>) : <div />;

    return (
      <div id="project-body">
        <div className="row justify-content-center">
          <div>
            {
              (Object.keys(this.state.exhibition).length !== 0) ?
              <img className="img-fluid project-poster" src={`${this.state.exhibition.poster}`} onError={this.addDefaultSrc} alt="project-poster" /> :
              <img className="img-fluid project-poster" src="../../resources/images/empty-poster-placeholder.png" alt="project-poster" />
            }
          </div>
        </div>
        <div className="card">
          <div className="exhibition-info card-block">
            <h4 className="info-type">{this.state.exhibition.exhibitionName}</h4>
            <div className="project-name project-info" />
            <div id="project-desc" className="project-info">{this.state.exhibition.exhibitionDescription}</div>
            <div id="tag-container">
              <span  className="info-type">Tags </span>
              {
                (this.state.isTagEditable) ?
                  <span>
                    <button className="btn btn-secondary" onClick={this.toggleTagEditable}>Cancel</button>
                    <input type="text" id="tag-input" className="form-control" onChange={this.handleTagInputChange} value={this.state.tagChange} />
                    <div className="add-icon-container" onClick={this.handleAddTags}>
                      <img className="add-icon" src="../../resources/images/add-icon.svg" alt="add-icon" />
                    </div>
                  </span> :
                  <button className="btn btn-secondary" onClick={this.toggleTagEditable}>Add Tags</button>
              }
            </div>
            <div id="project-tags" className="project-info">
            {
              this.state.tags.map((tag, i) =>
                <span key={`${i}${tag}`} className="badge badge-info">{tag}</span>
            )}
            </div>
          </div>
          <ul className="list-group list-group-flush">
            <li className="exhibition-info text-center list-group-item">
              <div id="media-container">
                <span  className="info-type">Related Media</span>
                {
                  (this.state.isMediaEditable) ?
                  <span>
                    <button className="btn btn-secondary" onClick={this.toggleMediaEditable}>Cancel</button>
                    <input type="text" id="media-input" className="form-control" onChange={this.handleMediaInputChange} value={this.state.mediaChange} placeholder="Media" />
                    <div className="add-icon-container" onClick={this.handleAddMedia}>
                      <img className="add-icon" src="../../resources/images/add-icon.svg" alt="add-icon" />
                    </div>
                  </span> :
                  <button className="btn btn-secondary" onClick={this.toggleMediaEditable}>Add Media</button>
                }
              </div>
              <div id="project-url" />
              <div id="project-media">
              {
                (Object.keys(this.state.exhibition).length !== 0) ?
                  this.state.exhibition.videos.map(media =>
                    <div className="embed-responsive embed-responsive-16by9" key={media}>
                      <iframe width="560" height="315"  className="embed-responsive-item" src={`https://www.youtube.com/embed/${media.slice(media.lastIndexOf('/') + 1, media.length)}`} allowFullScreen></iframe>
                    </div>
                  ) :
                  <div />
              }
              </div>
            </li>
            <li className="exhibition-info d-flex flex-column align-items-start list-group-item">
              <div className="info-type">Project Members</div>
              {
                (Object.keys(this.state.attendance).length !== 0) ?
                  this.state.attendance.map(attend =>
                    <Link to={`/profile/${attend.userEmail}`} key={attend.id}>
                      <div className="project-members">{attend.userName}</div>
                      {
                        (attend.reasons) ?
                          attend.reasons.map((reason, i) => <span className="badge badge-pill badge-primary" key={`${reason}${i}`}>{reason}</span>) :
                          <span />
                      }
                    </Link>
                  ) : <div />
              }
            </li>
            <li className="exhibition-info text-center card-block list-group-item">
              <div className="info-type">Comments</div>
              <div id="comment-input-container">
                <textarea className="form-control" rows="2" id="comment-input" value={this.state.currentComment} onChange={this.editComment}></textarea>
                <button id="submit-comment" type="button" className="btn btn-primary" onClick={this.submitComment}>Submit</button>
              </div>
              {isNotify}
              <div id="comment-list">
              {
                (this.state.comments.length > 0) ?
                this.state.comments.map(commentObject =>
                  <div key={commentObject.userEmail} id="user-comment-list">
                    <Link to={`/profile/${commentObject.userEmail}`}><h5 id="comment-sender">{commentObject.userEmail}</h5></Link>
                    <ul className="list-group">
                      {
                        commentObject.comments.map((comment, i) =>
                          (commentObject.userEmail === Auth.getToken().email.replace(/%40/i, '@')) ?
                            <li key={`${comment.content}${commentObject.userEmail}${i}`} className="user-comment-container list-group-item">
                              <div id="comment-timestamp">{new Date(comment.timestamp).toDateString()}</div>
                              <div id="comment">{comment.content}</div>
                            </li> :
                            <li key={`${comment.content}${commentObject.userEmail}${i}`} className="others-comment-container list-group-item">
                              <div id="comment-timestamp">{new Date(comment.timestamp).toDateString()}</div>
                              <div id="comment">{comment.content}</div>
                            </li>
                        )
                      }
                    </ul>
                  </div>
                ) : <div />
              }
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ExhibitionView;
