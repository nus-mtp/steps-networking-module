const express = require('express');

const router = new express.Router();

const User = require('../database/objectClasses/User');

import currentdb from '../currentdb';
const config = require('../config.json');
const ModelHandler = require('../database/models/ourModels');

// All Routes prefixed with 'user/'

router.get('/get/profile/:email', (req = {}, res, next) => {
  User.getUser(req.params.email, (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).json('Unable to fetch data!');
    } else if (user) {
      res.status(200).json({
        userEmail: user.email,
        userProfile: user.profile_picture,
        userName: user.name,
        userDescription: user.description,
        userSkills: user.skills,
        bookmarkedUsers: user.bookmarked_users,
      });
    } else {
      res.status(404).json('Nothing found!');
    }

    next();
  });
});

module.exports = router;
