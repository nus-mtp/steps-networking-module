import React from 'react';

const Signup = ({
  onSubmit,
  onChangeUsername,
  onChangeEmail,
  onChangePassword,
  onChangeDescription,
  onConfirmPassword,
  errors,
}) => (
  <div id="login-form" className="card">
    <h3 className="card-header">Sign Up</h3>
    <div className="card-block">
      {errors.summary && <div className="alert alert-danger error-message"><strong>Unable to register! </strong>{errors.summary}</div>}
      <form className="authentication-form">
        <div className="form-group has-danger">
          <label htmlFor="inputName">Username</label>
          <input type="text" className="form-control" id="inputName" aria-describedby="nameHelp" placeholder="Enter username" onChange={onChangeUsername} />
          <div className="form-control-feedback">{errors.name}</div>
        </div>
        <div className="form-group has-danger">
          <label htmlFor="inputEmail">Email address</label>
          <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" onChange={onChangeEmail} />
          <div className="form-control-feedback">{errors.email}</div>
        </div>
        <div className="form-group has-danger">
          <label htmlFor="inputPassword">Password</label>
          <input type="password" className="form-control" id="inputPassword" placeholder="Password" onChange={onChangePassword} />
          <div className="form-control-feedback">{errors.password}</div>
        </div>
        <div className="form-group has-danger">
          <label htmlFor="inputConfirmPassword">Confirm Password</label>
          <input type="password" className="form-control" id="inputConfirmPassword" placeholder="Confirm Password" onChange={onConfirmPassword} />
          <div className="form-control-feedback">{errors.confirmPassword}</div>
        </div>
        <div className="form-group">
          <label htmlFor="inputDescription">Description</label>
          <textarea type="text" className="form-control" id="inputDescription" rows="3" onChange={onChangeDescription} />
        </div>
        <button type="submit" className="btn btn-primary" onClick={onSubmit}>Submit</button>
      </form>
    </div>
  </div>
);

Signup.propTypes = {
  onSubmit: React.PropTypes.func.isRequired,
  onChangeUsername: React.PropTypes.func.isRequired,
  onChangeEmail: React.PropTypes.func.isRequired,
  onChangeDescription: React.PropTypes.func.isRequired,
  onChangePassword: React.PropTypes.func.isRequired,
  onConfirmPassword: React.PropTypes.func.isRequired,
  errors: React.PropTypes.objectOf(React.PropTypes.string).isRequired,
};

export default Signup;
