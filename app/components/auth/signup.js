import React from 'react';

class Signup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div id="login-form" className="card">
        <h3 className="card-header">Sign Up</h3>
        <div className="card-block">
          {this.props.errors.summary && <div className="alert alert-danger error-message"><strong>Unable to register! </strong>{this.props.errors.summary}</div>}
          <form className="authentication-form">
            <div className="form-group has-danger">
              <label htmlFor="inputName">Username</label>
              <input type="text" className="form-control" id="inputName" aria-describedby="nameHelp" placeholder="Enter username" ref="name" onChange={this.props.onChangeUsername}/>
              <div className="form-control-feedback">{this.props.errors.name}</div>
            </div>
            <div className="form-group has-danger">
              <label htmlFor="inputEmail">Email address</label>
              <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" ref="email" onChange={this.props.onChangeEmail}/>
              <div className="form-control-feedback">{this.props.errors.email}</div>
            </div>
            <div className="form-group has-danger">
              <label htmlFor="inputPassword">Password</label>
              <input type="password" className="form-control" id="inputPassword" placeholder="Password" ref="password" onChange={this.props.onChangePassword}/>
              <div className="form-control-feedback">{this.props.errors.password}</div>
            </div>
            <div className="form-group has-danger">
              <label htmlFor="inputConfirmPassword">Confirm Password</label>
              <input type="password" className="form-control" id="inputConfirmPassword" placeholder="Confirm Password" ref="confirmPassword" onChange={this.props.onConfirmPassword}/>
              <div className="form-control-feedback">{this.props.errors.confirmPassword}</div>
            </div>
            <div className="form-group">
              <label htmlFor="inputDescription">Description</label>
              <textarea type="text" className="form-control" id="inputDescription" rows="3" onChange={this.props.onChangeDescription} />
            </div>
            <button type="submit" className="btn btn-primary" onClick={this.props.onSubmit}>Submit</button>
          </form>
        </div>
      </div>
    );
  }
}

Signup.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  onChangeUsername: React.PropTypes.func.isRequired,
  onChangeEmail: React.PropTypes.func.isRequired,
  onChangeDescription: React.PropTypes.func.isRequired,
  onChangePassword: React.PropTypes.func.isRequired,
  onConfirmPassword: React.PropTypes.func.isRequired,
  errors: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired
};

export default Signup;
