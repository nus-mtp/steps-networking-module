const express = require('express');
const router = new express.Router();

import currentdb from '../currentdb';
const config = require('../config.json');
const ModelHandler = require('../database/models/ourModels');

router.get('/get/:name', (req = {}, res, next) => {
  const ModelHandlerObject = new ModelHandler().initWithParameters(config[currentdb].username,
                                                      config[currentdb].password,
                                                      config[currentdb].host,
                                                      config[currentdb].port,
                                                      config[currentdb].database);

  const User = ModelHandlerObject.getUserModel();

  User.where({ name: req.params.name }).lean().findOne((err, user) => {
    if (err) {
      res.status(500).json('Unable to fetch data!');
    } else {
      res.status(200).json(user);
    }

    ModelHandlerObject.disconnect();

    next();
  });
});

module.exports = router;
