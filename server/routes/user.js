const async = require('async');
const express = require('express');

const router = new express.Router();

const User = require('../database/objectClasses/User');

// Note: User Routes return JSON objects with key names
//       that differ from the User Mongoose Schema:
// See extractUserInfo under ../utils/utils to see actual conversion
const extractUserInfo = require('../utils/utils').extractUserInfo;

// Note: All Routes prefixed with 'user/'

router.get('/get/profile/:email', (req = {}, res, next) => {
  if (req.params && req.params.email) {
    User.setDBConnection(req.app.locals.db);

    User.getUser(req.params.email, (err, user) => {
      if (err) {
        console.log(err);
        res.status(500).json('Unable to fetch data!');
      } else if (user) {
        res.status(200).json(extractUserInfo(user));
      } else {
        res.status(204).json('Nothing found!');
      }
      next();
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

router.get('/get/chat/:email', (req = {}, res, next) => {
  if (req.params && req.params.email) {
    User.setDBConnection(req.app.locals.db);

    User.getBookmarksForUser(req.params.email, (err, bUsers) => {
      if (err) {
        res.status(500).json('Unable to process data!');
        next();
      } else if (bUsers && bUsers.length > 0) {
        res.status(200).json(bUsers.map(bUser => extractUserInfo(bUser)));
        next();
      } else {
        res.status(204).json('Nothing found!');
        next();
      }
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

router.post('/post/profile/set/description', (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.userDescription) {
    User.setDBConnection(req.app.locals.db);

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
        res.status(204).json('Nothing found!');
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
    User.setDBConnection(req.app.locals.db);

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
        res.status(204).json('Nothing found!');
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
    User.setDBConnection(req.app.locals.db);

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
            res.status(204).json('Nothing found!');
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
    User.setDBConnection(req.app.locals.db);

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
        res.status(204).json('Nothing found!');
      }
      next();
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

// Note: Requires User ID as request parameter 'bookmarkedUserid'
router.post('/post/profile/add/bUser', (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.bookmarkedUserId) {
    User.setDBConnection(req.app.locals.db);

    User.getUserById(req.body.bookmarkedUserId, (err, bUser) => {
      if (err) {
        if (err.name === 'CastError') {
          res.status(204).json('Cannot find User with that Id!');
          next();
        } else if (err.name === 'ValidationError') {
          console.log(err);
          res.status(403).json('Unauthorized!');
        } else {
          res.status(500).json('Unable to process request!');
          next();
        }
      } else if (bUser) {
        User.addBookmarkedUserForUser(
            req.body.userEmail,
            req.body.bookmarkedUserId,
            (err, user) => {
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
                res.status(204).json('Nothing found!');
              }
              next();
            });
      } else {
        res.status(204).json('Unable to find specified bUser!');
        next();
      }
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

router.post('/post/profile/remove/skill', (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.userSkill) {
    User.setDBConnection(req.app.locals.db);

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
        res.status(204).json('Nothing found!');
      }
      next();
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

// Note: Requires User ID as request parameter 'bookmarkedUserid'
router.post('/post/profile/remove/bUser', (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.bookmarkedUserId) {
    User.setDBConnection(req.app.locals.db);

    User.getUserById(req.body.bookmarkedUserId, (err, bUser) => {
      if (err) {
        if (err.name === 'CastError') {
          res.status(204).json('Cannot find User with that Id!');
          next();
        } else if (err.name === 'ValidationError') {
          console.log(err);
          res.status(403).json('Unauthorized!');
        } else {
          res.status(500).json('Unable to process request!');
          next();
        }
      } else if (bUser) {
        User.removeBookmarkedUserFromUser(
            req.body.userEmail,
            req.body.bookmarkedUserId,
            (err, user) => {
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
                res.status(204).json('Nothing found!');
              }
              next();
            });
      } else {
        res.status(204).json('Unable to find specified bUser!');
        next();
      }
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

// The Routes below utilize Comma-Separated Strings for the second argument in the Post Request
// Use <Array>.toString() to generate a Comma-Separated String from an Array

router.post('/post/search/skills', (req = {}, res, next) => {
  if (req.body && req.body.userSkills) {
    User.setDBConnection(req.app.locals.db);

    User.searchUsersByMultipleSkills(req.body.userSkills.split(','), (err, users) => {
      if (err) {
        if (err.name === 'ValidationError') {
          console.log(err);
          res.status(403).json('Unauthorized!');
        } else {
          console.log(err);
          res.status(500).json('Unable to post data!');
        }
      } else if (users && users.length > 0) {
        res.status(200).json(users.map(user => extractUserInfo(user)));
      } else {
        res.status(204).json('Nothing found!');
      }
      next();
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

router.post('/post/profile/set/skills', (req = {}, res, next) => {
  User.setDBConnection(req.app.locals.db);

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
        res.status(204).json('Nothing found!');
      }
      next();
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

// Note: Requires Comma-Separated String of User IDs as request parameter 'bookmarkedUserid'
router.post('/post/profile/set/bUsers', (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.bookmarkedUserIds) {
    User.setDBConnection(req.app.locals.db);

    async.mapLimit(req.body.bookmarkedUserIds.split(','), 5,
        (bookmarkedUserId, callback) => {
          User.getUserById(bookmarkedUserId, (err, bUser) => {
            if (err || !bUser) {
              callback(null, null);
            } else {
              callback(null, bookmarkedUserId);
            }
          });
        },
        (err, results) => {
          if (err || !results) {
            res.status(500).json('Unable to process request!');
            next();
          } else {
            const processedResults = results.filter(item => (item !== null));

            User.setBookmarksForUser(
                req.body.userEmail, processedResults,
                (err, user) => {
                  if (err) {
                    if (err.name === 'CastError') {
                      res.status(204).json('Cannot find User with that Id!');
                      next();
                    } else if (err.name === 'ValidationError') {
                      console.log(err);
                      res.status(403).json('Unauthorized!');
                    } else {
                      res.status(500).json('Unable to process request!');
                      next();
                    }
                  } else if (user) {
                    res.status(200).json(extractUserInfo(user));
                    next();
                  } else {
                    res.status(204).json('Unable to find specified bUser!');
                    next();
                  }
                });
          }
        },
        );
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

module.exports = router;
