import React from 'react';
import Signup from './signup';
import Auth from '../../database/auth';

class SignupView extends React.Component {
  constructor(props, context) {
    super(props, context);

    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    this.state = {
      errors: {},
      successMessage,
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

       console.log('email:', this.state.user.email);
       console.log('password:', this.state.user.password);
       const email = encodeURIComponent(this.state.user.email);
       const password = encodeURIComponent(this.state.user.password);
       const formData = `email=${email}&password=${password}`;

       const xhr = new XMLHttpRequest();
       xhr.open('post', '/auth/signup');
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
          Auth.authenticateUser(xhr.response.token);


          // change the current URL to /
          this.context.router.replace('/login');
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
      <Signup
        onSubmit={this.processForm}
        onChangePassword={this.handleUserPassword}
        onChangeEmail={this.handleUserEmail}
        errors={this.state.errors}
        successMessage={this.state.successMessage}
        user={this.state.user}
      />
    );
  }
}

SignupView.contextTypes = {
  router: React.PropTypes.object.isRequired
};


export default SignupView;
