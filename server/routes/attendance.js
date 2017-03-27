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

// Note: All Routes prefixed with 'attendance/'

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
      } else if (attendances) {
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
                        next();
                      } else {
                        res.status(200).json(results.filter(item => (item !== null)));
                        next();
                      }
                    });
      } else {
        res.status(204).json();
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
          } else if (attendances) {
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
                    next();
                  } else {
                    res.status(200).json(results.filter(item => (item !== null)));
                    next();
                  }
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
          } else if (attendances) {
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
                                next();
                              } else {
                                res.status(200).json(results.filter(item => (item !== null)));
                                next();
                              }
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

    Event.getEventById(req.params.id, (err, event) => {
      if (err) {
        res.status(500).json('Unable to fetch data!');
        next();
      } else if (event) {
        const eventName = event.event_name;
        Exhibition.searchExhibitionsByEvent(eventName, (err, exhibitions) => {
          if (err) {
            res.status(500).json('Unable to fetch data!');
            next();
          } else if (exhibitions) {
            async.mapLimit(exhibitions, 5,
                  (exhibition, callback) => {
                    if (exhibition) {
                      Attendance.searchAttendancesByKey(exhibition._id, (err, attendances) => {
                        if (err || !attendances) {
                          callback(null, null);
                        } else {
                          callback(null, attendances.map(attendance => attendance.user_email));
                        }
                      });
                    } else {
                      callback(null, null);
                    }
                  },
                  (err, results) => {
                    if (err || !results) {
                      res.status(500).json('Unable to process data!');
                      next();
                    } else {
                      const userEmailArray = removeDuplicates(
                          [].concat.apply([], results).filter(item => (item !== null)));

                      async.mapLimit(userEmailArray, 5,
                          (userEmail, callback) => {
                            if (userEmail) {
                              User.getUser(userEmail, (err, user) => {
                                if (err || !user) {
                                  callback(null, null);
                                } else {
                                  callback(null, extractUserInfo(user));
                                }
                              });
                            } else {
                              callback(null, null);
                            }
                          },
                          (err, results) => {
                            if (err || !results) {
                              res.status(500).json('Unable to process data!');
                              next();
                            } else {
                              res.status(200).json(results.filter(item => (item !== null)));
                              next();
                            }
                          },
                      );
                    }
                  });
          } else {
            res.status(204).json('Nothing found!');
            next();
          }
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
      } else if (attendances) {
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
                next();
              } else {
                res.status(200).json(results.filter(item => (item !== null)));
                next();
              }
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
      } else if (attendances) {
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
                next();
              } else {
                res.status(200).json(results.filter(item => (item !== null)));
                next();
              }
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
      } else if (attendances) {
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
                next();
              } else {
                res.status(200).json(results.filter(item => (item !== null)));
                next();
              }
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

// Search for Users attending an Event with a specified Reason
router.post('/post/search/oneEventAttendancesWithReason/', (req = {}, res, next) => {
  if (req.body && req.body.eventName && req.body.reason) {
    User.setDBConnection(req.app.locals.db);
    Event.setDBConnection(req.app.locals.db);
    Exhibition.setDBConnection(req.app.locals.db);
    Attendance.setDBConnection(req.app.locals.db);

    Event.getEvent(req.body.eventName, (err, event) => {
      if (err) {
        res.status(500).json('Unable to process data!');
        next();
      } else if (event) {
        Attendance.searchAttendancesByKeyAndReason(event._id,
                    req.body.reason, (err, attendances) => {
                      if (err) {
                        res.status(500).json('Unable to process data!');
                        next();
                      } else if (attendances) {
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
                                    next();
                                  } else {
                                    res.status(200).json(results.filter(item => (item !== null)));
                                    next();
                                  }
                                });
                      } else {
                        res.status(204).json('Nothing found!');
                        next();
                      }
                    });
      } else {
        res.status(204).json('Unable to find Event!');
        next();
      }
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

// Set Reasons for a particular Attendance
// Note: Requires Event or Exhibition ID as request body parameter 'id'
// Note: Requires reasons to be a Comma-Separated String rather than an Array
// Use <Array>.toString() to generate a Comma-Separated String from an Array
router.post('/post/set/oneAttendanceReasons', (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.id && req.body.reasons) {
    User.setDBConnection(req.app.locals.db);
    Event.setDBConnection(req.app.locals.db);
    Exhibition.setDBConnection(req.app.locals.db);
    Attendance.setDBConnection(req.app.locals.db);

    Attendance.updateReason(req.body.userEmail, req.body.id, req.body.reasons.split(','), (err, attendance) => {
      if (err) {
        res.status(500).json('Unable to process data!');
        next();
      } else if (attendance) {
        res.status(200).json(extractAttendanceInfo(attendance));
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

// Toggle User's Attendance for an Event
router.post('/post/oneEventAttendance/', (req = {}, res, next) => {
  if (req.body && req.body.userEmail && req.body.eventName) {
    User.setDBConnection(req.app.locals.db);
    Event.setDBConnection(req.app.locals.db);
    Exhibition.setDBConnection(req.app.locals.db);
    Attendance.setDBConnection(req.app.locals.db);

    User.getUser(req.body.userEmail, (err, user) => {
      if (err) {
        if (err.name === 'ValidationError') {
          console.log(err);
          res.status(403).json('Unauthorized!');
          next();
        } else {
          console.log(err);
          res.status(500).json('Unable to post data!');
          next();
        }
      } else if (user) {
        // User exists
        Event.getEvent(req.body.eventName, (err, event) => {
          if (err) {
            res.status(500).json('Unable to process request!');
            next();
          } else if (event) {
            // Event exists
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
                        console.log(err);
                        res.status(500).json('Unable to Toggle Attendance to Delete!');
                        next();
                      } else {
                        res.status(200).json('Attendance Removed!');
                        next();
                      }
                    });
                  } else {
                    // Create the Attendance
                    const attendanceDoc = new Attendance(user.email, event._id, 'event', []);
                    attendanceDoc.saveAttendance((err, attendance) => {
                      if (err || !attendance) {
                        res.status(500).json('Unable to Toggle Attendance to Create!');
                        next();
                      } else {
                        res.status(200).json('Attendance Added!');
                        next();
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
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

module.exports = router;
