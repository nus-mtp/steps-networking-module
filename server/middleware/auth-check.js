const jwt = require('jsonwebtoken');

const config = require('../config.json');

const ModelHandler = require('../database/models/ourModels');

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

    const ModelHandlerObj = new ModelHandler(config.devDbUri.host, config.devDbUri.port, config.devDbUri.database);
    const User = ModelHandlerObj.getUserModel();

    // check if a user exists
    return User.findById(userId, (userErr, user) => {
      if (userErr || !user) {
        return res.status(401).end();
      }

      ModelHandlerObj.disconnect();

      return next();
    });
  });
};
