const async = require('async');
const express = require('express');

const router = new express.Router();

const User = require('../database/objectClasses/User');
const Event = require('../database/objectClasses/Event');
const Exhibition = require('../database/objectClasses/Exhibition');
const Attendance = require('../database/objectClasses/Attendance');

const removeDuplicates = require('../utils/utils').removeDuplicates;

// Note: Attendance Routes return JSON objects with key names
//       that differ from the User, Event, Exhibition and Attendance Schemas.
// See extractExhibitionInfo under ../utils/utils to see actual conversion
const extractUserInfo = require('../utils/utils').extractUserInfo;
const extractEventInfo = require('../utils/utils').extractEventInfo;
const extractExhibitionInfo = require('../utils/utils').extractExhibitionInfo;
const extractAttendanceInfo = require('../utils/utils').extractAttendanceInfo;

const authCheckMiddleware = require('../middleware/auth-check');

// Note: All Routes prefixed with 'attendance/'

// Get one Attendance of a specified User and Event / Exhibition
// Note: Requires Event or Exhibition ID as request parameter 'id'
router.get('/get/oneUserAttendance/:email/:id', (req = {}, res, next) => {
  if (req.params && req.params.email && req.params.id) {
    Attendance.setDBConnection(req.app.locals.db);
    Attendance.searchAttendanceByUserAndKey(req.params.email, req.params.id, (err, attendance) => {
      if (err) {
        res.status(500).json('Unable to fetch data!');
      } else if (attendance) {
        res.status(200).json(extractAttendanceInfo(attendance));
      } else {
        res.status(204).json('Unable to find any Attendance!');
      }
      next();
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

// Get all the Attendances of a specified User
router.get('/get/oneUserAttendances/:email', (req = {}, res, next) => {
  if (req.params && req.params.email) {
    Attendance.setDBConnection(req.app.locals.db);
    Attendance.searchAttendancesByUser(req.params.email, (err, attendances) => {
      if (err) {
        res.status(500).json('Unable to fetch data!');
      } else if (attendances && attendances.length > 0) {
        res.status(200).json(attendances.map(attendance => extractAttendanceInfo(attendance)));
      } else {
        res.status(204).json('No Attendances found!');
      }
      next();
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

// Get all the Events and Exhibitions that a User is participating in / has participated in
router.get('/get/oneUserEventsAndExhibitions/:email', (req = {}, res, next) => {
  if (req.params && req.params.email) {
    User.setDBConnection(req.app.locals.db);
    Event.setDBConnection(req.app.locals.db);
    Exhibition.setDBConnection(req.app.locals.db);
    Attendance.setDBConnection(req.app.locals.db);

    Attendance.searchAttendancesByUser(req.params.email, (err, attendances) => {
      if (err) {
        res.status(500).json('Unable to fetch data!');
        next();
      } else if (attendances && attendances.length > 0) {
        async.mapLimit(attendances, 5,
                       (attendance, callback) => {
          // Limit number of concurrent connections made by this request to 5
                         if (attendance) {
                           const attendanceKey = attendance.attendance_key;
                           const attendanceType = attendance.attendance_type;

                           if (attendanceType === 'event') {
                             Event.getEventById(attendanceKey, (err, event) => {
                               if (err || !event) {
                                 callback(null, null);
                               } else {
                                 callback(null, extractEventInfo(event));
                               }
                             });
                           } else if (attendanceType === 'exhibition') {
                             Exhibition.getExhibitionById(attendanceKey, (err, exhibition) => {
                               if (err || !exhibition) {
                                 callback(null, null);
                               } else {
                                 callback(null, extractExhibitionInfo(exhibition));
                               }
                             });
                           } else {
                             callback(null, null);
                           }
                         } else {
                           callback(null, null);
                         }
                       },
                       (err, results) => {
                         if (err || !results) {
                           res.status(500).json('Unable to process data!');
                         } else {
                           const finalizedResults = results.filter(item => (item !== null));
                           if (finalizedResults && finalizedResults.length > 0) {
                             res.status(200).json(finalizedResults);
                           } else {
                             res.status(204).json('Nothing found!');
                           }
                         }
                         next();
                       });
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

// Get all the Exhibitions that a User is participating in / has participated in
router.get('/get/oneUserExhibitions/:email', (req = {}, res, next) => {
  if (req.params && req.params.email) {
    User.setDBConnection(req.app.locals.db);
    Event.setDBConnection(req.app.locals.db);
    Exhibition.setDBConnection(req.app.locals.db);
    Attendance.setDBConnection(req.app.locals.db);

    Attendance.searchAttendancesByUser(req.params.email, (err, attendances) => {
      if (err) {
        res.status(500).json('Unable to fetch data!');
        next();
      } else if (attendances && attendances.length > 0) {
        async.mapLimit(attendances, 5,
                       (attendance, callback) => {
          // Limit number of concurrent connections made by this request to 5
                         if (attendance) {
                           const attendanceKey = attendance.attendance_key;
                           const attendanceType = attendance.attendance_type;

                           if (attendanceType === 'exhibition') {
                             Exhibition.getExhibitionById(attendanceKey, (err, exhibition) => {
                               if (err || !exhibition) {
                                 callback(null, null);
                               } else {
                                 callback(null, extractExhibitionInfo(exhibition));
                               }
                             });
                           } else {
                             callback(null, null);
                           }
                         } else {
                           callback(null, null);
                         }
                       },
                       (err, results) => {
                         if (err || !results) {
                           res.status(500).json('Unable to process data!');
                         } else {
                           const finalizedResults = results.filter(item => (item !== null));
                           if (finalizedResults && finalizedResults.length > 0) {
                             res.status(200).json(finalizedResults);
                           } else {
                             res.status(204).json('Nothing found!');
                           }
                         }
                         next();
                       });
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

// Get all Events a User is attending / has attended
router.get('/get/oneUserEvents/:email', (req = {}, res, next) => {
  if (req.params && req.params.email) {
    User.setDBConnection(req.app.locals.db);
    Event.setDBConnection(req.app.locals.db);
    Exhibition.setDBConnection(req.app.locals.db);
    Attendance.setDBConnection(req.app.locals.db);

    Attendance.searchAttendancesByUser(req.params.email, (err, attendances) => {
      if (err) {
        res.status(500).json('Unable to fetch data!');
        next();
      } else if (attendances && attendances.length > 0) {
        async.mapLimit(attendances, 5,
                       (attendance, callback) => {
          // Limit number of concurrent connections made by this request to 5
                         if (attendance) {
                           const attendanceKey = attendance.attendance_key;
                           const attendanceType = attendance.attendance_type;

                           if (attendanceType === 'event') {
                             Event.getEventById(attendanceKey, (err, event) => {
                               if (err || !event) {
                                 callback(null, null);
                               } else {
                                 callback(null, extractEventInfo(event));
                               }
                             });
                           } else {
                             callback(null, null);
                           }
                         } else {
                           callback(null, null);
                         }
                       },
                       (err, results) => {
                         if (err || !results) {
                           res.status(500).json('Unable to process data!');
                         } else {
                           const finalizedResults = results.filter(item => (item !== null));
                           if (finalizedResults && finalizedResults.length > 0) {
                             res.status(200).json(finalizedResults);
                           } else {
                             res.status(204).json('Nothing found!');
                           }
                         }
                         next();
                       });
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

// Get all the Exhibitions a User is participating in / has participated in under one Event
router.get('/get/oneUserExhibitionsInEvent/:email/:eventName', (req = {}, res, next) => {
  if (req.params && req.params.email && req.params.eventName) {
    User.setDBConnection(req.app.locals.db);
    Event.setDBConnection(req.app.locals.db);
    Exhibition.setDBConnection(req.app.locals.db);
    Attendance.setDBConnection(req.app.locals.db);

    Attendance.searchAttendancesByUser(req.params.email, (err, attendances) => {
      if (err) {
        res.status(500).json('Unable to fetch data!');
        next();
      } else if (attendances && attendances.length > 0) {
        async.mapLimit(attendances, 5,
                       (attendance, callback) => {
          // Limit number of concurrent connections made by this request to 5
                         if (attendance) {
                           const attendanceKey = attendance.attendance_key;
                           const attendanceType = attendance.attendance_type;

                           if (attendanceType === 'exhibition') {
                             Exhibition.getExhibitionById(attendanceKey, (err, exhibition) => {
                               if (err || !exhibition) {
                                 callback(null, null);
                               } else if (exhibition.event_name === req.params.eventName) {
                                 callback(null, extractExhibitionInfo(exhibition));
                               } else {
                                 callback(null, null);
                               }
                             });
                           } else {
                             callback(null, null);
                           }
                         } else {
                           callback(null, null);
                         }
                       },
                       (err, results) => {
                         if (err || !results) {
                           res.status(500).json('Unable to process data!');
                         } else {
                           const finalizedResults = results.filter(item => (item !== null));
                           if (finalizedResults && finalizedResults.length > 0) {
                             res.status(200).json(finalizedResults);
                           } else {
                             res.status(204).json('Nothing found!');
                           }
                         }
                         next();
                       });
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

// Get the Users attending in either a specified Event / Exhibition
// Note: Requires Event or Exhibition ID as request parameter 'id'
router.get('/get/oneActivityAttendees/:id', (req = {}, res, next) => {
  if (req.params && req.params.id) {
    User.setDBConnection(req.app.locals.db);
    Event.setDBConnection(req.app.locals.db);
    Exhibition.setDBConnection(req.app.locals.db);
    Attendance.setDBConnection(req.app.locals.db);

    Attendance.searchAttendancesByKey(req.params.id, (err, attendances) => {
      if (err) {
        res.status(500).json('Unable to process data!');
        next();
      } else if (attendances && attendances.length > 0) {
        async.mapLimit(attendances, 5,
                       (attendance, callback) => {
                         if (attendance) {
                           User.getUser(attendance.user_email, (err, user) => {
                             if (err) {
                               callback(null, null);
                             } else if (user) {
                               callback(null, extractUserInfo(user));
                             } else {
                               callback(null, null);
                             }
                           });
                         } else {
                           callback(null, null);
                         }
                       },
                       (err, results) => {
                         if (err || !results) {
                           res.status(500).json('Unable to process data!');
                         } else {
                           const finalizedResults = results.filter(item => (item !== null));
                           if (finalizedResults && finalizedResults.length > 0) {
                             res.status(200).json(finalizedResults);
                           } else {
                             res.status(204).json('Nothing found!');
                           }
                         }
                         next();
                       });
      } else {
        res.status(204).json('Nothing found!');
        next();
      }
    });
  } else {
    res.status().json('Bad Request!');
    next();
  }
});

// Get the Users attending a particular Event
router.get('/get/oneEventAttendees/:eventName', (req = {}, res, next) => {
  if (req.params && req.params.eventName) {
    User.setDBConnection(req.app.locals.db);
    Event.setDBConnection(req.app.locals.db);
    Exhibition.setDBConnection(req.app.locals.db);
    Attendance.setDBConnection(req.app.locals.db);

    Event.getEvent(req.params.eventName, (err, event) => {
      if (err) {
        res.status(500).json('Unable to fetch data!');
        next();
      } else if (event) {
        Attendance.searchAttendancesByKey(event._id, (err, attendances) => {
          if (err) {
            res.status(500).json('Unable to fetch data!');
            next();
          } else if (attendances && attendances.length > 0) {
            async.mapLimit(attendances, 5,
                           (attendance, callback) => {
                             User.getUser(attendance.user_email, (err, user) => {
                               if (err || !user) {
                                 callback(null, null);
                               } else {
                                 callback(null, extractUserInfo(user));
                               }
                             });
                           },
                           (err, results) => {
                             if (err || !results) {
                               res.status(500).json('Unable to process data!');
                             } else {
                               const finalizedResults = results.filter(item => (item !== null));
                               if (finalizedResults && finalizedResults.length > 0) {
                                 res.status(200).json(finalizedResults);
                               } else {
                                 res.status(204).json('Nothing found!');
                               }
                             }
                             next();
                           });
          } else {
            res.status(204).json('Nothing found!');
            next();
          }
        });
      } else {
        res.status(204).json('Unable to find Event!!');
        next();
      }
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

// Get the Users participating in a particular Exhibition
router.get('/get/oneExhibitionExhibitors/:eventName/:exhibitionName', (req = {}, res, next) => {
  if (req.params && req.params.eventName && req.params.exhibitionName) {
    User.setDBConnection(req.app.locals.db);
    Event.setDBConnection(req.app.locals.db);
    Exhibition.setDBConnection(req.app.locals.db);
    Attendance.setDBConnection(req.app.locals.db);

    Exhibition.getExhibition(req.params.eventName, req.params.exhibitionName, (err, exhibition) => {
      if (err) {
        res.status(500).json('Unable to fetch data!');
        next();
      } else if (exhibition) {
        Attendance.searchAttendancesByKey(exhibition._id, (err, attendances) => {
          if (err) {
            res.status(500).json('Unable to fetch data!');
            next();
          } else if (attendances && attendances.length > 0) {
            async.mapLimit(attendances, 5,
                           (attendance, callback) => {
              // Limit number of concurrent connections made by this request to 5
                             User.getUser(attendance.user_email, (err, user) => {
                               if (err || !user) {
                                 callback(null, null);
                               } else {
                                 callback(null, extractUserInfo(user));
                               }
                             });
                           },
                           (err, results) => {
                             if (err || !results) {
                               res.status(500).json('Unable to process data!');
                             } else {
                               const finalizedResults = results.filter(item => (item !== null));
                               if (finalizedResults && finalizedResults.length > 0) {
                                 res.status(200).json(finalizedResults);
                               } else {
                                 res.status(204).json('Nothing found!');
                               }
                             }
                             next();
                           });
          } else {
            res.status(204).json('Nothing found!');
            next();
          }
        });
      } else {
        res.status(204).json('Unable to find Exhibition!');
        next();
      }
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

// Get the Users participating in at least 1 Exhibition within the given Event
// Note: Requires Event ID as request parameter 'id'
router.get('/get/oneEventExhibitors/:id', (req = {}, res, next) => {
  if (req.params && req.params.id) {
    User.setDBConnection(req.app.locals.db);
    Event.setDBConnection(req.app.locals.db);
    Exhibition.setDBConnection(req.app.locals.db);
    Attendance.setDBConnection(req.app.locals.db);

    async.waterfall([
      (callback) => {
        Event.getEventById(req.params.id, (err, event) => {
          if (err) {
            callback(500, null);
          } else if (event) {
            callback(null, event.event_name);
          } else {
            callback(204, null);
          }
        });
      },
      (eventName, callback) => {
        Exhibition.searchExhibitionsByEvent(eventName, (err, exhibitions) => {
          if (err) {
            callback(500, null);
          } else if (exhibitions && exhibitions.length > 0) {
            callback(null, removeDuplicates(exhibitions.map(exhibition => exhibition._id)));
          } else {
            callback(204, null);
          }
        });
      },
      (exhibitionIds, callback) => {
        async.mapLimit(exhibitionIds, 5,
                       (exhibitionId, callback) => {
                         Attendance.searchAttendancesByKey(
            exhibitionId,
            (err, attendances) => {
              if (err) {
                callback(null, null);
              } else if (attendances && attendances.length > 0) {
                callback(null, attendances.map(attendance => attendance.user_email));
              } else {
                callback(null, null);
              }
            },
          );
                       },
                       (err, results) => {
                         if (err || !results) {
                           callback(500, null);
                         } else if (results.length === 0) {
                           callback(204, null);
                         } else {
                           const userEmailArray =
                  removeDuplicates([].concat.apply([], results).filter(item => (item !== null)));
                           callback(null, userEmailArray);
                         }
                       });
      },
      (userEmailArray, callback) => {
        async.mapLimit(userEmailArray, 5,
                       (userEmail, callback) => {
                         User.getUser(userEmail, (err, user) => {
                           if (err || !user) {
                             callback(null, null);
                           } else {
                             callback(null, extractUserInfo(user));
                           }
                         });
                       },
                       (err, users) => {
                         if (err || !users) {
                           callback(500, null);
                         } else if (users.length === 0) {
                           callback(204, null);
                         } else {
                           callback(200, users);
                         }
                       });
      },
    ], (status, users) => {
      if (status === 200) {
        res.status(200).json(users);
      } else if (status === 204) {
        res.status(204).json('Nothing found!');
      } else {
        res.status(500).json('Unable to process the data!');
      }
      next();
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

// Search for Users who are attending an Event / Exhibition for given reasons
// Note: Requires Event or Exhibition ID as request body parameter 'id'
// Note: Requires reasons to be a Comma-Separated String rather than an Array
// Use <Array>.toString() to generate a Comma-Separated String from an Array
router.post('/post/search/activity/reasons', (req = {}, res, next) => {
  if (req.body && req.body.id && req.body.reasons) {
    User.setDBConnection(req.app.locals.db);
    Event.setDBConnection(req.app.locals.db);
    Exhibition.setDBConnection(req.app.locals.db);
    Attendance.setDBConnection(req.app.locals.db);

    Attendance.searchAttendancesByKeyAndReasons(req.body.id, req.body.reasons.split(','), (err, attendances) => {
      if (err) {
        if (err.name === 'ValidationError') {
          res.status(403).json('Unauthorized!');
        } else {
          res.status(500).json('Unable to post data!');
        }
        next();
      } else if (attendances && attendances.length > 0) {
        async.mapLimit(attendances, 5,
                       (attendance, callback) => {
                         User.getUser(attendance.user_email, (err, user) => {
                           if (err) {
                             callback(null, null);
                           } else {
                             callback(null, extractUserInfo(user));
                           }
                         });
                       },
                       (err, results) => {
                         if (err || !results) {
                           res.status(500).json('Unable to process data!');
                         } else {
                           const finalizedResults = results.filter(item => (item !== null));
                           if (finalizedResults && finalizedResults.length > 0) {
                             res.status(200).json(finalizedResults);
                           } else {
                             res.status(204).json('Nothing found!');
                           }
                         }
                         next();
                       });
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

// Search for Users who are participating in an Event as an Exhibitor, for given reasons
// Note: Requires Event ID as request body parameter 'id'
// Note: Requires reasons to be a Comma-Separated String rather than an Array
// Use <Array>.toString() to generate a Comma-Separated String from an Array
router.post('/post/search/event/exhibitors/reasons', (req = {}, res, next) => {
  if (req.body && req.body.id && req.body.reasons) {
    User.setDBConnection(req.app.locals.db);
    Event.setDBConnection(req.app.locals.db);
    Exhibition.setDBConnection(req.app.locals.db);
    Attendance.setDBConnection(req.app.locals.db);

    async.waterfall([
      (callback) => {
        Event.getEventById(req.body.id, (err, event) => {
          if (err) {
            callback(500, null);
          } else if (event) {
            callback(null, event.event_name);
          } else {
            callback(204, null);
          }
        });
      },
      (eventName, callback) => {
        Exhibition.searchExhibitionsByEvent(eventName, (err, exhibitions) => {
          if (err) {
            callback(500, null);
          } else if (exhibitions && exhibitions.length > 0) {
            callback(null, removeDuplicates(exhibitions.map(exhibition => exhibition._id)));
          } else {
            callback(204, null);
          }
        });
      },
      (exhibitionIds, callback) => {
        async.mapLimit(exhibitionIds, 5,
                       (exhibitionId, callback) => {
                         Attendance.searchAttendancesByKeyAndReasons(
            exhibitionId,
            req.body.reasons.split(','),
            (err, attendances) => {
              if (err) {
                callback(null, null);
              } else if (attendances && attendances.length > 0) {
                callback(null, attendances.map(attendance => attendance.user_email));
              } else {
                callback(null, null);
              }
            },
          );
                       },
                       (err, results) => {
                         if (err || !results) {
                           callback(500, null);
                         } else if (results.length === 0) {
                           callback(204, null);
                         } else {
                           const userEmailArray =
                  removeDuplicates([].concat.apply([], results).filter(item => (item !== null)));
                           callback(null, userEmailArray);
                         }
                       });
      },
      (userEmailArray, callback) => {
        async.mapLimit(userEmailArray, 5,
                       (userEmail, callback) => {
                         User.getUser(userEmail, (err, user) => {
                           if (err || !user) {
                             callback(null, null);
                           } else {
                             callback(null, extractUserInfo(user));
                           }
                         });
                       },
                       (err, users) => {
                         if (err || !users) {
                           callback(500, null);
                         } else if (users.length === 0) {
                           callback(204, null);
                         } else {
                           callback(200, users);
                         }
                       });
      },
    ], (status, users) => {
      if (status === 200) {
        res.status(200).json(users);
      } else if (status === 204) {
        res.status(204).json('Nothing found!');
      } else {
        res.status(500).json('Unable to process the data!');
      }
      next();
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

// Toggle User's Attendance for an Event
router.post('/post/oneEventAttendance/', authCheckMiddleware, (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.eventName) {
    if (req.auth_user_email && req.auth_user_email !== req.body.userEmail) {
      res.status(403).json('Unauthorized!');
      next();
    } else {
      User.setDBConnection(req.app.locals.db);
      Event.setDBConnection(req.app.locals.db);
      Exhibition.setDBConnection(req.app.locals.db);
      Attendance.setDBConnection(req.app.locals.db);

      User.getUser(req.body.userEmail, (err, user) => {
        if (err) {
          if (err.name === 'ValidationError') {
            res.status(403).json('Unauthorized!');
          } else {
            res.status(500).json('Unable to post data!');
          }
          next();
        } else if (user) {
          // User exists
          Event.getEvent(req.body.eventName, (err, event) => {
            if (err) {
              res.status(500).json('Unable to process request!');
              next();
            } else if (event) {
              // Event exists

              // Get all the exhibitions in the event
              Exhibition.searchExhibitionsByEvent(req.body.eventName, (err, exhibitionList) => {
                if (err) {
                  res.status(500).json('Unable to fetch data!');
                  next();
                } else if (exhibitionList && exhibitionList.length > 0) {
                  async.mapLimit(exhibitionList, 5, (exhibition, callback) => {
                    if (exhibition) {
                      Attendance.getAttendance(req.body.userEmail, exhibition._id, (err, attendanceObj) => {
                        Exhibition.getExhibitionById(exhibition._id, (err, results) => {
                        });
                        if (err || !attendanceObj) {
                          callback(null, null);
                        } else {
                          callback(null, extractAttendanceInfo(attendanceObj));
                        }
                      });
                    } else {
                      callback(null, null);
                    }
                  }, (err, results) => {
                    const finalizedResults = results.filter(item => (item !== null));
                    if (finalizedResults && finalizedResults.length > 0) {
                      res.status(423).json('Toggle not allowed');
                    } else {
                      // Toggle existance of Attendance
                      Attendance.searchAttendanceByUserAndKey(user.email, event._id,
                                                              (err, attendance) => {
                                                                if (err) {
                                                                  res.status(500).json('Unable to process request');
                                                                  next();
                                                                } else if (attendance) {
                          // Delete this Attendance
                                                                  Attendance.deleteAttendance(attendance.user_email, attendance.attendance_key,
                                                      (err) => {
                                                        if (err) {
                                                          res.status(500).json('Unable to Toggle Attendance to Delete!');
                                                        } else {
                                                          res.status(200).json('Attendance Removed!');
                                                        }
                                                        next();
                                                      });
                                                                } else {
                          // Create the Attendance
                                                                  const attendanceDoc = new Attendance(user.email, event._id, 'event', ['nil']);
                                                                  attendanceDoc.saveAttendance((err, attendance) => {
                                                                    if (err || !attendance) {
                                                                      res.status(500).json('Unable to Toggle Attendance to Create!');
                                                                    } else {
                                                                      res.status(200).json('Attendance Added!');
                                                                    }
                                                                    next();
                                                                  });
                                                                }
                                                              });
                    }
                  });
                }
              });
            } else {
              res.status(204).json('Unable to find Event!');
              next();
            }
          });
        } else {
          res.status(204).json('Unable to find User!');
          next();
        }
      });
    }
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

// Set Reasons for a Attendance of a User
// Note: Requires Event or Exhibition ID as request body parameter 'id'
// Note: Requires reasons to be a Comma-Separated String rather than an Array
// Use <Array>.toString() to generate a Comma-Separated String from an Array
router.post('/post/set/oneAttendanceReasons', authCheckMiddleware, (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.id && req.body.reasons) {
    if (req.auth_user_email && req.auth_user_email !== req.body.userEmail) {
      res.status(403).json('Unauthorized!');
      next();
    } else {
      User.setDBConnection(req.app.locals.db);
      Event.setDBConnection(req.app.locals.db);
      Exhibition.setDBConnection(req.app.locals.db);
      Attendance.setDBConnection(req.app.locals.db);

      Attendance.updateReason(req.body.userEmail, req.body.id, req.body.reasons.split(','), (err, attendance) => {
        if (err) {
          res.status(500).json('Unable to process data!');
        } else if (attendance) {
          res.status(200).json(extractAttendanceInfo(attendance));
        } else {
          res.status(204).json('Nothing found!');
        }
        next();
      });
    }
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

module.exports = router;
