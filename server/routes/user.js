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
    userNotification: user.will_notify,
    isDeleted: user.is_deleted,
  };
}

// All Routes prefixed with 'user/'

router.get('/get/profile/:email', (req = {}, res, next) => {
  if (req.params && req.params.email) {
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
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

router.get('/get/search/:skill', (req = {}, res, next) => {
  if (req.params && req.params.skill) {
    User.searchUsersBySkills(req.param.skill, (err, users) => {
      if (err) {
        console.log(err);
        res.status(500).json('Unable to fetch data!');
      } else if (users) {
        res.status(200).json(users.map(user => extractUserInfo(user)));
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

router.post('/post/profile/set/description', (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.userDescription) {
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

router.post('/post/profile/set/picture', (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.userProfilePicture) {
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

router.post('/post/profile/set/notification', (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.userNotification) {
    User.updateUserNotification(
        req.body.userEmail, req.body.userNotification.toLowerCase() === 'true', (err, user) => {
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

router.post('/post/profile/add/skill', (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.userSkill) {
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

router.post('/post/profile/add/bUser', (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.bookmarkedUser) {
    User.addBookmarkedUserForUser(req.body.userEmail, req.body.bookmarkedUser, (err, user) => {
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

router.post('/post/profile/remove/skill', (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.userSkill) {
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

router.post('/post/profile/remove/bUser', (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.bookmarkedUser) {
    User.removeBookmarkedUserFromUser(req.body.userEmail, req.body.bookmarkedUser, (err, user) => {
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
// Use <Array>.toString() to generate a Comma-Separated String from an Array

router.post('/post/profile/set/skills', (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.userSkills) {
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

router.post('/post/profile/set/bUsers', (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.bookmarkedUsers) {
    User.setBookmarksForUser(req.body.userEmail, req.body.bookmarkedUsers.split(','), (err, user) => {
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
