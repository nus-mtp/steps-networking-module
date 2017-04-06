const jwt = require('jsonwebtoken');
const PassportLocalStrategy = require('passport-local');
const ModelHandler = require('../database/models/ourModels');

module.exports = db => new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true,
}, (req, email, password, done) => {
  const User = new ModelHandler().initWithConnection(db).getUserModel();

  const userData = {
    name: req
      .body
      .name
      .trim(),
    email: email.trim(),
    password: password.trim(),
  };

  const newUser = new User(userData);
  newUser.save((err) => {
    if (err) {
      return done(err);
    }

    const payload = {
      sub: newUser.get('_id'),
    };

    // create a token string
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    const data = {
      name: newUser.name,
    };

    return done(null, token, data);
  });
});
