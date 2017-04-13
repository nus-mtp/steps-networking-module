import React from 'react';
import Auth from '../../database/auth';
import NotFound from '../home/notFound';
import { tagSuggestions } from '../../database/suggestions';
import { Link } from 'react-router';
import { WithContext as ReactTags } from 'react-tag-input';

class ExhibitionView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentComment: '',  // current comment that has not been saved to database
      comments: [],  // comment cache
      exhibition: {},
      attendance: {},
      feedbackComment: '',
      errorComment: '',
      feedbackTags: '', // any feedback that are not errors
      errorTags: '',
      isExhibitior: false,  // whether current user is an exhibitor of this exhibition
      isTagEditable: false, // whether tag can be edited and save
      is404: false, // whether this exhibition is valid
    };

    // populate cache with data from server
    this.retrieveData();

    this.editComment = this.editComment.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.toggleTagEditable = this.toggleTagEditable.bind(this);
    this.handleDeleteTag = this.handleDeleteTag.bind(this);
    this.handleAdditionTag = this.handleAdditionTag.bind(this);
    this.handleDragTag = this.handleDragTag.bind(this);
    this.saveTags = this.saveTags.bind(this);
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
    * Contains all HTTP GET interactions with database
    * Interactions are exhibition, comments and attendance
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
        const exhibition = xhr.response;
        exhibition.tags = (xhr.response && xhr.response.tags.length > 0) ? xhr.response.tags.map((skill, i) => {
          return {
            id: i,
            text: skill,
          };
        }) : [];
        this.setState({
          exhibition,
          is404: false,
        });
      } else {
        this.setState({
          is404: true,
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
        xhr.response.map(exhibitor => {
          if (Auth.isUserAuthenticated() && exhibitor.userEmail === Auth.getToken().email.replace(/%40/i, '@')) {
            this.setState({
              isExhibitior: true,
            })
          }
        });

        this.setState({
          attendance: xhr.response,
        });
      } else {

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
      xhr.setRequestHeader('Authorization', `Bearer ${JSON.stringify(Auth.getToken())}`);
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
      xhr.setRequestHeader('Authorization', `Bearer ${JSON.stringify(Auth.getToken())}`);
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

  /**
    * Remove tags for exhibition
    * Function is bound to ReactTags
    * @param index of tag to be deleted
    */
  handleDeleteTag(i) {
    const exhibition = this.state.exhibition;
    exhibition.tags = exhibition.tags.filter((tag, index) => index !== i);

    this.setState({ exhibition, });
  }

  /**
    * Enable re-ordering of tags
    * Function is bound to ReactTags
    * @param selected tag,
    *        current position of selected tag,
    *        new position of selected tag
    */
  handleDragTag(tag, currPos, newPos) {
    const tags = [ ...this.state.exhibition.tags ];

    // mutate array
    tags.splice(currPos, 1);
    tags.splice(newPos, 0, tag);

    // re-render
    const exhibition = this.state.exhibition;
    exhibition.tags = tags;
    this.setState({ exhibition, });
  }

  /**
    * Add and cache new tag
    * Function is bound to ReactTags
    * @param new tag
    */
  handleAdditionTag(tag) {
    const exhibition = this.state.exhibition;
    exhibition.tags = [
      ...this.state.exhibition.tags,
      {
        id: this.state.exhibition.tags.length + 1,
        text: tag,
      }
    ];

    this.setState({ exhibition, });
  }

  /**
    * Save tags to database with HTTP POST
    */
  saveTags() {
    const tagArray = this.state.exhibition.tags.map(tag => { return tag.text });

    const eventName = encodeURIComponent(this.state.exhibition.eventName);
    const exhibitionName = encodeURIComponent(this.state.exhibition.exhibitionName);
    const tags = encodeURIComponent(tagArray.toString());
    const formData = `eventName=${eventName}&exhibitionName=${exhibitionName}&tags=${tags}`;

    const xhr = new XMLHttpRequest();
    xhr.open('post', '/exhibition/post/oneExhibition/set/tags');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success
        this.setState({
          feedbackTags: 'Successfully added',
          errorTags: '',
          isTagEditable: !this.state.isTagEditable,
        });
      } else {
        // failure
        this.setState({
          feedbackTags: '',
          errorTags: xhr.response,
        });
      }
    });
    xhr.send(formData);
  }

  toggleTagEditable() {
    this.setState({
      isTagEditable: !this.state.isTagEditable,
    });
  }

  addDefaultSrc(event) {
    event.target.src = "../../resources/images/empty-poster-placeholder.png";
  }

  render() {
    // render feedback/error when user submits a comment
    const isNotifyComment = (this.state.errorComment || this.state.feedbackComment) ? ((this.state.feedbackComment) ?
      <div className="alert alert-success" role="alert">
        <strong>Success!</strong> {this.state.feedbackComment}
      </div> :
      <div className="alert alert-danger" role="alert">
        <strong>Error!</strong> {this.state.errorComment}
      </div>) : <div />;

    // render feedback/error when user saves the tags.
    const isNotifyTags = (this.state.errorTags || this.state.feedbackTags) ? ((this.state.feedbackTags) ?
      <div className="alert alert-success" role="alert">
        <strong>Success!</strong> {this.state.feedbackTags}
      </div> :
      <div className="alert alert-danger" role="alert">
        <strong>Error!</strong> {this.state.errorTags}
      </div>) : <div />;

    return (
      (this.state.is404) ? <NotFound /> :
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

            <div id="project-tags" className="project-info">
              {isNotifyTags}
              <span className="info-type">Tags: </span>
              {
                (this.state.isTagEditable) ?
                  <span>
                    <button className="btn btn-secondary" onClick={this.toggleTagEditable}>Cancel</button>
                    <button className="btn btn-primary" onClick={this.saveTags}>Save</button>
                    <ReactTags
                      tags={this.state.exhibition.tags}
                      suggestions={tagSuggestions}
                      handleDelete={this.handleDeleteTag}
                      handleAddition={this.handleAdditionTag}
                      handleDrag={this.handleDragTag}
                      placeholder="Enter to add"
                    />
                  </span> :
                  <span>
                    {
                      (this.state.isExhibitior) ? <button className="btn btn-secondary" onClick={this.toggleTagEditable}>Add Tags</button> : <div />
                    }
                    <div>
                    {
                      (Object.keys(this.state.exhibition).length !== 0) ?
                        this.state.exhibition.tags.map((tag, i) =>
                          <span key={`${tag.id}`} className="badge badge-info">{tag.text}</span>
                        ) : <div />
                     }
                    </div>
                  </span>
              }
            </div>
          </div>
          <ul className="list-group list-group-flush">
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
              {isNotifyComment}
              <div id="comment-list">
              {
                (this.state.comments.length > 0) ?
                this.state.comments.map(commentObject =>
                  <div key={commentObject.userEmail} id="user-comment-list">
                    <Link to={`/profile/${commentObject.userEmail}`}><h5 id="comment-sender">{commentObject.userEmail}</h5></Link>
                    <ul className="list-group">
                      {
                        commentObject.comments.map((comment, i) =>
                          <li
                            key={`${comment.content}${commentObject.userEmail}${i}`}
                            className={`${(commentObject.userEmail === Auth.getToken().email.replace(/%40/i, '@')) ? "user-comment-container" : "others-comment-container"} list-group-item`}>
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

ExhibitionView.contextTypes = {
  router: React.PropTypes.object.isRequired,
};

export default ExhibitionView;
