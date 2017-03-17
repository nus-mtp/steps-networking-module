const express = require('express');
const router = new express.Router();

import currentdb from '../currentdb';
const config = require('../config.json');
const Event = require ('../database/objectClasses/Event.js');

router.get('/allEvents', (req = {}, res, next) => {
  
  Event.getAllEvents(function (err, eventObjs){
    if (err) {
      res.status(500).json('Unable to fetch data!');
    } else {
      res.status(200).json(eventObjs.map((eventObj) => {
        return {
          name: eventObj.event_name,
          start_date: eventObj.start_date,
          end_date: eventObj.end_date,
          venue: eventObj.event_location,
          description: eventObj.event_description,
        };
      }));
    }
  });
});

module.exports = router;
