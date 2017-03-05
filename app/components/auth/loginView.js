import React from 'react';
import Login from './login';
import Auth from '../../database/auth';
import Paths from '../../paths';

class LoginView extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      errors: {},
      user: {
        email: '',
        password: '',
      }
    }
    this.processForm = this.processForm.bind(this);
    this.handleUserEmail = this.handleUserEmail.bind(this);
    this.handleUserPassword = this.handleUserPassword.bind(this);
  }

  /**
  * Process the form.
  *
  * @param {object} event - the JavaScript event object
  */
    processForm(e) {
       // prevent default action. in this case, action is the form submission event
       e.preventDefault();

       const email = encodeURIComponent(this.state.user.email);
       const password = encodeURIComponent(this.state.user.password);
       const formData = `email=${email}&password=${password}`;

       const xhr = new XMLHttpRequest();
        xhr.open('post', '/auth/login');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          // success

          // change the component-container state
          this.setState({
            errors: {}
          });

          // save the token
          Auth.authenticateUser({
            token: xhr.response.token,
            email,
          });


          // change the current URL to /
          this.context.router.replace(Paths.event);
        } else {
          // failure

          // change the component state
          const errors = xhr.response.errors ? xhr.response.errors : {};
          errors.summary = xhr.response.message;

          this.setState({
            errors
          });
        }
      });
      xhr.send(formData);

    }

    handleUserPassword(e) {
      this.setState({
        user: {
          email: this.state.user.email,
          password: e.target.value,
        }
      });
    }

  handleUserEmail(e) {
    this.setState({
      user: {
        email: e.target.value,
        password: this.state.user.password,
      }
    });
  }

  render() {
    return (
      <Login
        onSubmit={this.processForm}
        onChangePassword={this.handleUserPassword}
        onChangeEmail={this.handleUserEmail}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }
}

LoginView.contextTypes = {
  router: React.PropTypes.object.isRequired
};


export default LoginView;
