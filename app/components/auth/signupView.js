import React from 'react';
import Signup from './signup';

class SignupView extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      errors: {},
      user: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        description: '',
      }
    }

    this.processForm = this.processForm.bind(this);
    this.handleUsername = this.handleUsername.bind(this);
    this.handleUserEmail = this.handleUserEmail.bind(this);
    this.handleUserPassword = this.handleUserPassword.bind(this);
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
    this.handleUserDescription = this.handleUserDescription.bind(this);
  }

  /**
  * Process the form.
  *
  * @param {object} event - the JavaScript event object
  */
    processForm(e) {
       // prevent default action. in this case, action is the form submission event
       e.preventDefault();

       const name = encodeURIComponent(this.state.user.name);
       const email = encodeURIComponent(this.state.user.email);
       const password = encodeURIComponent(this.state.user.password);
       const description = encodeURIComponent(this.state.user.description);
       const confirmPassword = encodeURIComponent(this.state.user.confirmPassword);
       const formData = `name=${name}&email=${email}&password=${password}&description=${description}&confirmPassword=${confirmPassword}`;

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

          // set a message
          localStorage.setItem('successMessage', xhr.response.message);

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

    handleUsername(e) {
      let user = this.state.user;
      user.name = e.target.value;
      this.setState({
        user,
      });
    }

    handleUserPassword(e) {
      let user = this.state.user;
      user.password = e.target.value;
      this.setState({
        user,
      });
    }

    handleConfirmPassword(e) {
      let user = this.state.user;
      user.confirmPassword = e.target.value;
      this.setState({
        user,
      });
    }

    handleUserEmail(e) {
      let user = this.state.user;
      user.email = e.target.value;
      this.setState({
        user,
      });
    }

    handleUserDescription(e) {
      let user = this.state.user;
      user.description = e.target.value;
      this.setState({
        user,
      });
    }

    render() {
      return (
        <Signup
          onSubmit={this.processForm}
          onChangeUsername={this.handleUsername}
          onChangePassword={this.handleUserPassword}
          onConfirmPassword={this.handleConfirmPassword}
          onChangeEmail={this.handleUserEmail}
          onChangeDescription={this.handleUserDescription}
          errors={this.state.errors}
          user={this.state.user}
        />
      );
    }
}

SignupView.contextTypes = {
  router: React.PropTypes.object.isRequired
};


export default SignupView;
