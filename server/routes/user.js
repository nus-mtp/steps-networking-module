const express = require('express');

const router = new express.Router();

const User = require('../database/objectClasses/User');

/**
 * Extracts out the relevant information from a supplied User document.
 *
 * @param {String} user: The User document returned from a User objectClass method.
 * @returns {{id, userEmail: *, userProfile: (*|String|string), userName: *, userDescription: *, userSkills: (*|Array|skills|{$regex}), bookmarkedUsers: (*|Array)}}
 */
function extractUserInfo(user) {
  return {
    id: user._id,
    userEmail: user.email,
    userProfilePicture: user.profile_picture,
    userName: user.name,
    userDescription: user.description,
    userSkills: user.skills,
    bookmarkedUsers: user.bookmarked_users,
  };
}

// All Routes prefixed with 'user/'

router.get('/get/profile/:email', (req = {}, res, next) => {
  User.getUser(req.params.email, (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).json('Unable to fetch data!');
    } else if (user) {
      res.status(200).json(extractUserInfo(user));
    } else {
      res.status(404).json('Nothing found!');
    }

    next();
  });
});

router.post('/post/profile/description', (req = {}, res, next) => {
  if (req.body) {
    User.updateUserDescription(req.body.userEmail, req.body.userDescription, (err, user) => {
      if (err) {
        if (err.name === 'ValidationError') {
          console.log(err);
          res.status(403).json('Unauthorized!');
        } else {
          console.log(err);
          res.status(500).json('Unable to post data!');
        }
      } else if (user) {
        res.status(200).json(extractUserInfo(user));
      } else {
        res.status(404).json('Nothing found!');
      }
      next();
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

router.post('/post/profile/picture', (req = {}, res, next) => {
  if (req.body) {
    User.updateUserProfilePicture(req.body.userEmail, req.body.userProfilePicture, (err, user) => {
      if (err) {
        if (err.name === 'ValidationError') {
          console.log(err);
          res.status(403).json('Unauthorized!');
        } else {
          console.log(err);
          res.status(500).json('Unable to post data!');
        }
      } else if (user) {
        res.status(200).json(extractUserInfo(user));
      } else {
        res.status(404).json('Nothing found!');
      }
      next();
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

router.post('/post/profile/addSkill', (req = {}, res, next) => {
  if (req.body) {
    User.addSkillToUserSkills(req.body.userEmail, req.body.userSkill, (err, user) => {
      if (err) {
        if (err.name === 'ValidationError') {
          console.log(err);
          res.status(403).json('Unauthorized!');
        } else {
          console.log(err);
          res.status(500).json('Unable to post data!');
        }
      } else if (user) {
        res.status(200).json(extractUserInfo(user));
      } else {
        res.status(404).json('Nothing found!');
      }
      next();
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

router.post('/post/profile/removeSkill', (req = {}, res, next) => {
  if (req.body) {
    User.removeSkillFromUser(req.body.userEmail, req.body.userSkill, (err, user) => {
      if (err) {
        if (err.name === 'ValidationError') {
          console.log(err);
          res.status(403).json('Unauthorized!');
        } else {
          console.log(err);
          res.status(500).json('Unable to post data!');
        }
      } else if (user) {
        res.status(200).json(extractUserInfo(user));
      } else {
        res.status(404).json('Nothing found!');
      }
      next();
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

// The Routes below utilize Comma-Separated Strings for the second argument in the Post Request

router.post('/post/profile/setSkill', (req = {}, res, next) => {
  if (req.body) {
    User.setSkillsForUser(req.body.userEmail, req.body.userSkills.split(','), (err, user) => {
      if (err) {
        if (err.name === 'ValidationError') {
          console.log(err);
          res.status(403).json('Unauthorized!');
        } else {
          console.log(err);
          res.status(500).json('Unable to post data!');
        }
      } else if (user) {
        res.status(200).json(extractUserInfo(user));
      } else {
        res.status(404).json('Nothing found!');
      }
      next();
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});



module.exports = router;
