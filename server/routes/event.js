const express = require('express');
const router = new express.Router();
const Event = require('../database/objectClasses/Event');

router.get('/get/allEvents', (req = {}, res, next) => {
  Event.getAllEvents((err, eventObjs) => {
    if (err) {
      res.status(500).json('Unable to fetch data!');
      next();
    } else if (eventObjs) {
      res.status(200).json(eventObjs.map(eventObj => ({
        id: eventObj._id,
        name: eventObj.event_name,
        start_date: eventObj.start_date,
        end_date: eventObj.end_date,
        venue: eventObj.event_location,
        description: eventObj.event_description,
        event_poster: eventObj.event_picture,
        siteMap: eventObj.map,
        tags: eventObj.tags,
      })));
      next();
    } else {
      res.status(404).json('Nothing found!');
      next();
    }
  });
});

router.get('/get/oneEvent/:eventName', (req = {}, res, next) => {
  Event.getEvent(req.params.eventName, (err, eventObj) => {
    if (err) {
      res.status(500).json('Unable to fetch data!');
      next();
    } else if (eventObj) {
      res.status(200).json({
        id: eventObj._id,
        name: eventObj.event_name,
        start_date: eventObj.start_date,
        end_date: eventObj.end_date,
        venue: eventObj.event_location,
        description: eventObj.event_description,
        event_poster: eventObj.event_picture,
        siteMap: eventObj.map,
        tags: eventObj.tags,
      });
      next();
    } else {
      res.status(404).json('Nothing found!');
      next();
    }
  });
});

router.get('/get/searchTag/:tag', (req = {}, res, next) => {
  Event.searchEventsByTag(req.params.tag, (err, eventObjs) => {
    if (err) {
      res.status(500).json('Unable to fetch data!');
      next();
    } else if (eventObjs) {
      res.status(200).json(eventObjs.map(eventObj => ({
        id: eventObj._id,
        name: eventObj.event_name,
        start_date: eventObj.start_date,
        end_date: eventObj.end_date,
        venue: eventObj.event_location,
        description: eventObj.event_description,
        event_poster: eventObj.event_picture,
        siteMap: eventObj.map,
      })));
      next();
    } else {
      res.status(404).json('Nothing found!');
      next();
    }
  });
});

router.post('/post/updateMap', (req = {}, res, next) => {
  if (req.body && req.body.eventName && req.body.map){
    Event.updateEventMap(req.body.eventName, req.body.map, (err, results) => {
      if (err) {
        res.status(500).json('Unable to save data!');
      } else if (results) {
        res.status(200).send('Added!');
      } else {
        res.status(404).json('Message object not found!');
      }
      next();
    });
  } else {
    res.status(400).send('Bad request!');
  }
});

router.post('/post/updateEventPicture', (req = {}, res, next) => {
  if (req.body && req.body.eventName && req.body.eventPicture){
    Event.updateEventPicture(req.body.eventName, req.body.eventPicture, (err, results) => {
      if (err) {
        res.status(500).json('Unable to save data!');
      } else if (results) {
        res.status(200).send('Added!');
      } else {
        res.status(404).json('Message object not found!');
      }
      next();
    });
  } else {
    res.status(400).send('Bad request!');
    next();
  }
});

router.post('/post/updateTags', (req = {}, res, next) => {
  if (req.body && req.body.eventName && req.body.tags){
    Event.updateEventPicture(req.body.eventName, req.body.tags.split(','), (err, results) => {
      if (err) {
        res.status(500).json('Unable to save data!');
      } else if (results) {
        res.status(200).send('Added!');
      } else {
        res.status(404).json('Message object not found!');
      }
      next();
    });
  } else {
    res.status(400).send('Bad request!');
    next();
  }
});

module.exports = router;
