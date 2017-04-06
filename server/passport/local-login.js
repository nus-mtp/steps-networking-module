const jwt = require('jsonwebtoken');
const PassportLocalStrategy = require('passport-local').Strategy;
const ModelHandler = require('../database/models/ourModels');

module.exports = db => new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true,
}, (req, email, password, done) => {
  const userData = {
    email: email.trim(),
    password: password.trim(),
  };

  const User = new ModelHandler().initWithConnection(db).getUserModel();

  // find a user by email address
  return User.findOne({
    email: userData.email,
  }, (err, user) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      const error = new Error('Incorrect email or password');
      error.name = 'IncorrectCredentialsError';

      return done(error);
    }

    // check if a hashed user's password is equal to a value saved in the database
    return user.comparePassword(userData.password, (passwordErr, isMatch) => {
      if (err) {
        return done(err);
      }

      if (!isMatch) {
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError';

        return done(error);
      }

      const payload = {
        sub: user.get('_id'),
      };

      // create a token string
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      const data = {
        name: user.name,
      };

      return done(null, token, data);
    });
  });
});