import React from 'react';
import { Link } from 'react-router';

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div id="login-form" className="card">
        <h3 className="card-header">Login</h3>
        <div className="card-block">
          { this.props.errors.summary && <div className="alert alert-danger error-message"><strong>Unable to login! </strong>{this.props.errors.summary}</div> }
          <form className="authentication-form">
            <div className="form-group has-warning">
              <label htmlFor="inputEmail">Email address</label>
              <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" ref="email" onChange={this.props.onChangeEmail}/>
              <div className="form-control-feedback">{this.props.errors.email}</div>
            </div>
            <div className="form-group has-warning">
              <label htmlFor="inputPassword">Password</label>
              <input type="password" className="form-control" id="inputPassword" placeholder="Password" ref="password" onChange={this.props.onChangePassword}/>
              <div className="form-control-feedback">{this.props.errors.password}</div>
            </div>
            <button type="submit" className="btn btn-primary" onClick={this.props.onSubmit}>Submit</button>
          </form>
        </div>
        <div className="card-block">
          Don&apos;t have an account? <Link to="/signup">Create one!</Link>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  onChangeEmail: React.PropTypes.func.isRequired,
  onChangePassword: React.PropTypes.func.isRequired,
  errors: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired
};

export default Login;
