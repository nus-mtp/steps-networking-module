import React from 'react';

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div id="login-form">
        {this.props.successMessage && <p className="success-message">{this.props.successMessage}</p>}
        {this.props.errors.summary && <p className="error-message">{this.props.errors.summary}</p>}
        <form>
          <div className="form-group">
            <label htmlFor="inputEmail">Email address</label>
            <input type="email" className="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email" ref="email" onChange={this.props.onChangeEmail}/>
          </div>
          <div className="form-group">
            <label htmlFor="inputPassword">Password</label>
            <input type="password" className="form-control" id="inputPassword" placeholder="Password" ref="password" onChange={this.props.onChangePassword}/>
          </div>
          <button type="submit" className="btn btn-primary" onClick={this.props.onSubmit}>Submit</button>
        </form>
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
