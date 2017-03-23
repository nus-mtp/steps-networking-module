const async = require('async');
const express = require('express');

const router = new express.Router();

const User = require('../database/objectClasses/User');
const Event = require('../database/objectClasses/Event');
const Exhibition = require('../database/objectClasses/Exhibition');
const Attendance = require('../database/objectClasses/Attendance');

const extractUserInfo = require('../utils/utils').extractUserInfo;
const extractEventInfo = require('../utils/utils').extractEventInfo;
const extractExhibitionInfo = require('../utils/utils').extractExhibitionInfo;
const extractAttendanceInfo = require('../utils/utils').extractAttendanceInfo;

// All Routes prefixed with 'attendance/'

// Get the Users attending an Event
router.get('/get/oneEventAttendances/:eventName', (req = {}, res, next) => {
  if (req.params && req.params.eventName) {
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
            res.status(200).json([]);
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

// Get the Users participating in an Exhibition
router.get('/get/oneExhibitionParticipants/:eventName/:exhibitionName', (req = {}, res, next) => {
  if (req.params && req.params.eventName && req.params.exhibitionName) {
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
            res.status(200).json([]);
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

// Get all the Events and Exhibitions that a User is participating in / has participated in
router.get('/get/oneUserAttendances/:email', (req = {}, res, next) => {
  if (req.params && req.params.email) {
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
        res.status(200).json([]);
        next();
      }
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

// Get all Events a User is attending / has attended
router.get('/get/oneUserEventAttendances/:email', (req = {}, res, next) => {
  if (req.params && req.params.email) {
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
        res.status(200).json([]);
        next();
      }
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

// Get all the Exhibitions a User is participating in / has participated in under one Event
router.get('/get/oneUserAttendancesForEvent/:email/:eventName', (req = {}, res, next) => {
  if (req.params && req.params.email && req.params.eventName) {
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
        res.status(200).json([]);
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
    Event.getEvent(req.body.eventName, (err, event) => {
      if (err) {
        res.status(500).json('Unable to process data!');
        next();
      } else if (event) {
        Attendance.searchAttendanceByKeyAndReason(event._id,
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
                        res.status(200).json([]);
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
    Attendance.updateReason(req.body.userEmail, req.body.id, req.body.reasons.split(','), (err, attendance) => {
      if (err) {
        res.status(500).json('Unable to process data!');
        next();
      } else if (attendance) {
        res.status(200).json(extractAttendanceInfo(attendance));
        next();
      } else {
        res.status(204).json('Unable to find attendance for specified User and Event / Exhibition');
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
