const express = require('express');

const router = new express.Router();

const User = require('../database/objectClasses/User');

import currentdb from '../currentdb';
const config = require('../config.json');
const ModelHandler = require('../database/models/ourModels');

router.get('/get/name/:email', (req = {}, res, next) => {
  User.getUser(req.params.email, (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).json('Unable to fetch data!');
    } else {
      res.status(200).json(user);
    }

    next();
  });
});

module.exports = router;
