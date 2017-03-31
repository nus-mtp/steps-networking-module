import React from 'react';
import { Link } from 'react-router';
import { sampleComments } from './sampleData';

class ExhibitionView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentComment: '',
      comments: sampleComments,
      isTagEditable: false,
      isMediaEditable: false,
      tags: [],
      media: [],
      tagChange: '',
      mediaChange: '',
      exhibition: {},
      attendance: {},
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

  retrieveData() {
    let pathname = this.props.location.pathname;
    const exhibitionName = pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length);

    pathname = pathname.slice(0, pathname.lastIndexOf('/'));
    const eventName = pathname.slice(pathname.lastIndexOf('/') + 1, pathname.length);

    this.getExhibition(eventName, exhibitionName);
    this.getAttendance(eventName, exhibitionName);
  }

  getExhibition(event, exhibition) {
    const xhr = new XMLHttpRequest();
    xhr.open('get', `/exhibition/get/oneExhibition/${event}/${exhibition}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      this.setState({
        exhibition: xhr.response,
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
      this.setState({
        attendance: xhr.response,
      });
    });
    xhr.send();
  }

  editComment(event) {
    this.setState({
      currentComment: event.target.value,
    });
  }

  submitComment() {
    const comments = sampleComments;
    const tempEmail = 'test@test.com'; // to be deleted
    const isEmailPresent = comments.find(obj => obj.email === tempEmail);

    if (isEmailPresent) {
      isEmailPresent.comments.push(this.state.currentComment);
      const newArray = comments.filter(obj => obj.email !== tempEmail);
      newArray.push(isEmailPresent);
      this.setState({
        comments: newArray,
      })
    } else {
      const newComment = {
        email: 'test@test.com',
        comments: [this.state.currentComment],
      };
      comments.push(newComment);
      this.setState({
        comments,
      });
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
    return (
      <div id="project-body">
        <div className="row justify-content-center">
          <div>
            {
              (Object.keys(this.state.exhibition).length !== 0) ?
              <img className="img-fluid project-poster" src={`${this.state.exhibition.poster}`} onError={this.addDefaultSrc} alt="project-poster" /> :
              <img className="img-fluid project-poster" src="../../resources/images/dummy-poster.png" alt="project-poster" />
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
              <div id="project-comments" />
              <div id="comment-input-container">
                <textarea className="form-control" rows="2" id="comment-input" value={this.state.currentComment} onChange={this.editComment}></textarea>
                <button id="submit-comment" type="button" className="btn btn-primary" onClick={this.submitComment}>Submit</button>
              </div>
              <ul id="comment-list" className="list-group">
                {
                  this.state.comments.map(commentObject =>
                    <div key={commentObject.email}>
                    {
                      commentObject.comments.map((comment, i) =>
                        <li key={`${comment}${commentObject.email}${i}`} className="comment-container list-group-item">
                          <div id="comment">{comment}</div>
                          <div id="comment-sender">- {commentObject.email}</div>
                        </li>
                    )}
                    </div>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default ExhibitionView;
