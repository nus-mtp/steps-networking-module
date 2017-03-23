import React from 'react';
import { sampleComments } from './sampleData';

class ProjectView extends React.Component {
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
    };

    this.editComment = this.editComment.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.toggleTagEditable = this.toggleTagEditable.bind(this);
    this.toggleMediaEditable = this.toggleMediaEditable.bind(this);
    this.handleAddTags = this.handleAddTags.bind(this);
    this.handleAddMedia = this.handleAddMedia.bind(this);
    this.handleTagInputChange = this.handleTagInputChange.bind(this);
    this.handleMediaInputChange = this.handleMediaInputChange.bind(this);
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

  render() {
    return (
      <div id="project-body">
        <div className="row justify-content-center">
          <div>
            <img className="img-fluid project-poster" src="../../resources/images/dummy-poster.png" alt="project-poster" />
          </div>
        </div>
        <div className="card">
          <div className="exhibition-info card-block">
            <div className="info-type">Project Title: </div>
            <div className="project-name project-info" />
            <div className="info-type">Description: </div>
            <div id="project-desc" className="project-info" />
            <div className="info-type" id="tag-container">
              <span>Tags: </span>
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
              <div className="info-type" id="media-container">
                <span>Related Media</span>
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
              <div id="project-media" />
            </li>

            <li className="exhibition-info text-center list-group-item">
              <div className="info-type">Project Members</div>
              <div id="project-members" />
              <button id="broadcast-msg" type="button" className="btn btn-info">Broadcast Message</button>
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

export default ProjectView;
