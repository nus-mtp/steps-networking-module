const jwt = require('jsonwebtoken');

const ModelHandler = require('../database/models/ourModels'); // require('mongoose').model('User');

/**
 *  The Auth Checker middleware function.
 */
module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).end();
  }

  try {
    // get the last part from a authorization header string like "bearer token-value"
    const token = JSON.parse(req.headers.authorization.split(' ')[1]).token;

    // decode the token using a secret key-phrase
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      // the 401 code is for unauthorized status
      if (err) {
        res.status(401).end();
      }

      const userId = decoded.sub;

      const ModelHandlerObj = new ModelHandler().initWithConnection(req.app.locals.db);

      const User = ModelHandlerObj.getUserModel();

      // check if a user exists
      User.findById(userId, (userErr, user) => {
        if (userErr || !user) {
          res.status(401).end();
        }

        req.auth_user_email = user.get('email');

        next();
      });
    });
  } catch (err) {
    res.status(401).end();
  }
};
