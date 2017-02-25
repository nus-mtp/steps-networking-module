const PassportLocalStrategy = require('passport-local');

module.exports = (db) => new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true,
}, (req, email, password, done) => {
	const User = db.model('User');
	
  const userData = {
    name: req.body.name.trim(),
    email: email.trim(),
    password: password.trim(),
    description: req.body.description.trim(),
  };

  const newUser = new User(userData);
  newUser.save((err) => {
    if (err) {
      return done(err);
    }

    return done(null);
  });
});
