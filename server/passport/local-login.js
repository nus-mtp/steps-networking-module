const jwt = require('jsonwebtoken');
const PassportLocalStrategy = require('passport-local').Strategy;
const config = require('../config.json');
const ModelHandler = require('../database/models/ourModels');

module.exports = (db) => new PassportLocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
  }, (req, email, password, done) => {
    const userData = {
      email: email.trim(),
      password: password.trim()
    };
  
  const ModelHandlerObj = new ModelHandler(db.host, db.port, db.name);
	const User = ModelHandlerObj.getUserModel();
	
  // find a user by email address
  return User.findOne({ email: userData.email }, (err, user) => {
    if (err) { 
      ModelHandlerObj.disconnect();
      
      return done(err); 
    }

    if (!user) {
      const error = new Error('Incorrect email or password');
      error.name = 'IncorrectCredentialsError';
      
      ModelHandlerObj.disconnect();
      
      return done(error);
    }

    // check if a hashed user's password is equal to a value saved in the database
    return user.comparePassword(userData.password, (passwordErr, isMatch) => {
      if (err) { 
        ModelHandlerObj.disconnect();
        
        return done(err); 
      }

      if (!isMatch) {
        const error = new Error('Incorrect email or password');
        error.name = 'IncorrectCredentialsError';
        
        ModelHandlerObj.disconnect();
        
        return done(error);
      }

      const payload = {
        sub: user._id
      };

      // create a token string
      const token = jwt.sign(payload, config.jwtSecret);
      const data = {
        name: user.name
      };
      
      ModelHandlerObj.disconnect();

      return done(null, token, data);
    });
  });
});
