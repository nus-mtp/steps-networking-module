const async = require('async');
const express = require('express');

const router = new express.Router();

const Event = require('../database/objectClasses/Event');
const Exhibition = require('../database/objectClasses/Exhibition');
const Attendance = require('../database/objectClasses/Attendance');

const extractEventInfo = require('../utils/utils').extractEventInfo;
const extractExhibitionInfo = require('../utils/utils').extractExhibitionInfo;
const extractAttendanceInfo = require('../utils/utils').extractAttendanceInfo;

// All Routes prefixed with 'attendance/'
// Note: An Attendance Document tracks the Event or Exhibition ID

// Get all the Events and Exhibitions that a User is participating in
router.get('/get/oneUserAttendances/:email', (req = {}, res, next) => {
  if (req.params && req.params.email) {
    Attendance.searchAttendancesByUser(req.params.email, (err, attendances) => {
      if (err) {
        res.status(500).json('Unable to fetch data!');
        next();
      } else if (attendances) {
        async.map(attendances,
            (attendance, callback) => {
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
              if (err) {
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

module.exports = router;
