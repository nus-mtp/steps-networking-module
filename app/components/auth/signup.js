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
          {this.props.successMessage && <div className="alert alert-success success-message"><strong>Registered successfully! </strong>{this.props.successMessage}</div>}
          {this.props.errors.summary && <div className="alert alert-danger error-message"><strong>Unable to register! </strong>{this.props.errors.summary}</div>}
          <form className="authentication-form">
            <div className="form-group">
              <label htmlFor="inputEmail">Email address</label>
              <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" ref="email" onChange={this.props.onChangeEmail}/>
              <small>{this.props.errors.email}</small>
            </div>
            <div className="form-group">
              <label htmlFor="inputPassword">Password</label>
              <input type="password" className="form-control" id="inputPassword" placeholder="Password" ref="password" onChange={this.props.onChangePassword}/>
              <small>{this.props.errors.password}</small>
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
  onChangeEmail: React.PropTypes.func.isRequired,
  onChangePassword: React.PropTypes.func.isRequired,
  errors: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired
};

export default Signup;
