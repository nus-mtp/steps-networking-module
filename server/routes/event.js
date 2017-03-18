const express = require('express');
const router = new express.Router();

import currentdb from '../currentdb';
const config = require('../config.json');
const Event = require ('../database/objectClasses/Event.js');

router.get('/get/allEvents', (req = {}, res, next) => {

  Event.getAllEvents((err, eventObjs) => {
    if (err) {
      res.status(500).json('Unable to fetch data!');
    } else if (eventObjs) {
      res.status(200).json(eventObjs.map((eventObj) => {
        return {
          name: eventObj.event_name,
          start_date: eventObj.start_date,
          end_date: eventObj.end_date,
          venue: eventObj.event_location,
          description: eventObj.event_description,
          event_poster: eventObj.event_picture,
          siteMap: eventObj.map,
        };
      }));
    } else {
      res.status(404).json('Nothing found!');
    }
  });
});

router.get('/get/oneEvent/:eventName', (req = {}, res, next) => {
  Event.getEvent(req.params.eventName, (err, eventObj) =>{
    if (err){
      res.status(500).json('Unable to fetch data!');
    } else if (eventObj) {
      res.status(200).json({
        name: eventObj.event_name,
        start_date: eventObj.start_date,
        end_date: eventObj.end_date,
        venue: eventObj.event_location,
        description: eventObj.event_description,
        event_poster: eventObj.event_picture,
        siteMap: eventObj.map,
      });
    } else {
      res.status(404).json('Nothing found!');
    }
  });
});

router.get('/get/searchTag/:tag', (req = {}, res, next) => {

  Event.searchEventsByTag(req.params.tag, (err, eventObjs) => {
    if (err) {
      res.status(500).json('Unable to fetch data!');
    } else if (eventObjs) {
      res.status(200).json(eventObjs.map((eventObj) => {
        return {
          name: eventObj.event_name,
          start_date: eventObj.start_date,
          end_date: eventObj.end_date,
          venue: eventObj.event_location,
          description: eventObj.event_description,
          event_poster: eventObj.event_picture,
          siteMap: eventObj.map,
        };
      }));
    } else {
      res.status(404).json('Nothing found!');
    }
  });
});

module.exports = router;
