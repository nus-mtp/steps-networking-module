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
    } else if (eventObjs && eventObjs[0]) {
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
    } else if (eventObjs && eventObjs[0]) {
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

// The Routes below utilize Comma-Separated Strings for the second argument in the Post Request
// Use <Array>.toString() to generate a Comma-Separated String from an Array
router.post('/post/search/tags', (req = {}, res, next) => {
  if (req.body && req.body.tags) {
    Event.setDBConnection(req.app.locals.db);

    Event.searchEventsByTags(req.body.tags.split(','), (err, events) => {
      if (err) {
        if (err.name === 'ValidationError') {
          console.log(err);
          res.status(403).json('Unauthorized!');
        } else {
          console.log(err);
          res.status(500).json('Unable to post data!');
        }
      } else if (events && events[0]) {
        res.status(200).json(events.map(event => extractEventInfo(event)));
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

router.post('/post/updateTags', (req = {}, res, next) => {
  if (req.body && req.body.eventName && req.body.tags) {
    Event.setDBConnection(req.app.locals.db);

    Event.updateEventTag(req.body.eventName, req.body.tags.split(','), (err, event) => {
      if (err) {
        res.status(500).json('Unable to save data!');
      } else if (event) {
        res.status(200).send(extractEventInfo(event));
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
