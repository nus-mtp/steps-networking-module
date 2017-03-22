const express = require('express');

const router = new express.Router();

const Attendance = require('../database/objectClasses/Attendance');

const extractAttendanceInfo = require('../utils/utils').extractAttendanceInfo;

// All Routes prefixed with 'attendance/'
// Note: An Attendance Document tracks the Event or Exhibition ID

router.get('/get/oneUserAttendances/:email', (req = {}, res, next) => {
  if (req.params && req.params.email) {
    Attendance.searchAttendancesByUser(req.params.email, (err, attendances) => {
      if (err) {
        res.status(500).json('Unable to fetch data!');
      } else if (attendances) {
        res.status(200).json(attendances.map(attendance => extractAttendanceInfo(attendance)));
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
