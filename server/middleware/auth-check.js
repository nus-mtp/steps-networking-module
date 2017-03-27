import currentdb from '../currentdb';

const jwt = require('jsonwebtoken');

const ModelHandler = require('../database/models/ourModels'); // require('mongoose').model('User');
const config = require('../config.json');

/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  const token = req.headers.authorization.split(' ')[1];

  // decode the token using a secret key-phrase
  return jwt.verify(token, config.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }

    const userId = decoded.sub;

    const ModelHandlerObj = new ModelHandler().initWithParameters(
        [currentdb].username,
        config[currentdb].password,
        config[currentdb].host,
        config[currentdb].port,
        config[currentdb].database);

    const User = ModelHandlerObj.getUserModel();

    // check if a user exists
    return User.findById(userId, (userErr, user) => {
      ModelHandlerObj.disconnect();

      if (userErr || !user) {
        return res.status(401).end();
      }

      return next();
    });
  });
};
