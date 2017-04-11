import React from 'react';
import { Link } from 'react-router';

const Login = ({ onSubmit, onChangeEmail, onChangePassword, errors }) => (
  <div id="login-form" className="card">
    <h3 className="card-header">Login</h3>
    <div className="card-block">
      { errors.summary && <div className="alert alert-danger error-message"><strong>Unable to login! </strong>{errors.summary}</div> }
      <form className="authentication-form">
        <div className="form-group has-warning">
          <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Email" onChange={onChangeEmail} />
          <div className="form-control-feedback">{errors.email}</div>
        </div>
        <div className="form-group has-warning">
          <input type="password" className="form-control" id="inputPassword" placeholder="Password" onChange={onChangePassword} />
          <div className="form-control-feedback">{errors.password}</div>
        </div>
        <button type="submit" className="btn btn-primary" onClick={onSubmit}>Submit</button>
      </form>
    </div>
    <div className="card-block">
      Don&apos;t have an account? <Link to="/signup">Create one!</Link>
    </div>
  </div>
);

Login.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  onChangeEmail: React.PropTypes.func.isRequired,
  onChangePassword: React.PropTypes.func.isRequired,
  errors: React.PropTypes.objectOf(React.PropTypes.string).isRequired,
};

export default Login;
