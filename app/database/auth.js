class Auth {

  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {object} token
   */
  static authenticateUser(token) {
    localStorage.setItem('token', JSON.stringify(token));
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticateUser() {
    localStorage.removeItem('token');
  }

  /**
   * Get a token value.
   *
   * @returns {object}
   */

  static getToken() {
    return JSON.parse(localStorage.getItem('token'));
  }

}

export default Auth;
