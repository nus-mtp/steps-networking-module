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
        res.status(404).json('Nothing found!');
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
        res.status(404).json('Nothing found!');
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
        res.status(404).json('Nothing found!');
        next();
      }
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

// Get the Users participating of an Exhibition
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
                  // Limit number of concurrent connections made by this request to at most 5
                  User.getUser(attendance.user_email, (err, user) => {
                    if (err || !user) {
                      callback(null, null);
                    } else {
                      callback(null, user);
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
            res.status(404).json('Cannot find any Participants for this Exhibition!');
            next();
          }
        });
      } else {
        res.status(404).json('Unable to find Exhibition!');
        next();
      }
    });
  } else {
    res.status(400).json('Bad Request!');
    next();
  }
});

module.exports = router;
