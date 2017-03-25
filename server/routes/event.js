const express = require('express');

const router = new express.Router();

const Event = require('../database/objectClasses/Event');

const extractEventInfo = require('../utils/utils').extractEventInfo;

// All Routes prefixed with 'event/'

router.get('/get/allEvents', (req = {}, res, next) => {
  Event.setDBConnection(req.app.locals.db);
  Event.getAllEvents((err, eventObjs) => {
    if (err) {
      res.status(500).json('Unable to fetch data!');
      next();
    } else if (eventObjs[0]) {
      res.status(200).json(eventObjs.map(eventObj => extractEventInfo(eventObj)));
      next();
    } else {
      res.status(204).json('Nothing found!');
      next();
    }
  });
});

router.get('/get/oneEvent/:eventName', (req = {}, res, next) => {
  Event.setDBConnection(req.app.locals.db);
  Event.getEvent(req.params.eventName, (err, eventObj) => {
    if (err) {
      console.log(err);
      res.status(500).json('Unable to fetch data!');
      next();
    } else if (eventObj) {
      res.status(200).json(extractEventInfo(eventObj));
      next();
    } else {
      res.status(204).json('Nothing found!');
      next();
    }
  });
});

router.get('/get/searchTag/:tag', (req = {}, res, next) => {
  Event.setDBConnection(req.app.locals.db);
  Event.searchEventsByTag(req.params.tag, (err, eventObjs) => {
    if (err) {
      res.status(500).json('Unable to fetch data!');
      next();
    } else if (eventObjs[0]) {
      res.status(200).json(eventObjs.map(eventObj => extractEventInfo(eventObj)));
      next();
    } else {
      res.status(204).json('Nothing found!');
      next();
    }
  });
});

router.post('/post/updateMap', (req = {}, res, next) => {
  if (req.body && req.body.eventName && req.body.map) {
    Event.setDBConnection(req.app.locals.db);
    Event.updateEventMap(req.body.eventName, req.body.map, (err, results) => {
      if (err) {
        res.status(500).json('Unable to save data!');
      } else if (results) {
        res.status(200).send('Added!');
      } else {
        res.status(204).json('Message object not found!');
      }
      next();
    });
  } else {
    res.status(400).send('Bad request!');
  }
});

router.post('/post/updateEventPicture', (req = {}, res, next) => {
  if (req.body && req.body.eventName && req.body.eventPicture) {
    Event.setDBConnection(req.app.locals.db);
    Event.updateEventPicture(req.body.eventName, req.body.eventPicture, (err, results) => {
      if (err) {
        res.status(500).json('Unable to save data!');
      } else if (results) {
        res.status(200).send('Added!');
      } else {
        res.status(204).json('Message object not found!');
      }
      next();
    });
  } else {
    res.status(400).send('Bad request!');
    next();
  }
});

router.post('/post/updateTags', (req = {}, res, next) => {
  if (req.body && req.body.eventName && req.body.tags) {
    Event.setDBConnection(req.app.locals.db);
    Event.updateEventTag(req.body.eventName, req.body.tags.split(','), (err, results) => {
      if (err) {
        res.status(500).json('Unable to save data!');
      } else if (results) {
        res.status(200).send('Added!');
      } else {
        res.status(204).json('Message object not found!');
      }
      next();
    });
  } else {
    res.status(400).send('Bad request!');
    next();
  }
});

module.exports = router;
