const PassportLocalStrategy = require('passport-local');
const ModelHandler = require('../database/models/ourModels');

module.exports = (db) => new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true,
}, (req, email, password, done) => {
  
  const ModelHandlerObj = new ModelHandler(db.host, db.port, db.name);
	const User = ModelHandlerObj.getUserModel();
	
  const userData = {
    name: req.body.name.trim(),
    email: email.trim(),
    password: password.trim(),
    description: req.body.description.trim(),
  };

  const newUser = new User(userData);
  newUser.save((err) => {
    if (err) {
      ModelHandlerObj.disconnect();
      
      return done(err);
    }
    
    ModelHandlerObj.disconnect();
    
    return done(null);
  });
});
