const express = require('express');

const router = new express.Router();

const Exhibition = require('../database/objectClasses/Exhibition');

// Note: Exhibition Routes return JSON objects with key names
//       that differ from the Exhibition Mongoose Schema:
// See extractExhibitionInfo under ../utils/utils to see actual conversion
const extractExhibitionInfo = require('../utils/utils').extractExhibitionInfo;

// Note: All Routes prefixed with 'exhibition/'

router.get('/get/allExhibitions', (req = {}, res, next) => {
  Exhibition.setDBConnection(req.app.locals.db);
  Exhibition.getAllExhibitions((err, exhibitions) => {
    if (err) {
      console.log(err);
      res.status(500).json('Unable to fetch data!');
    } else if (exhibitions) {
      res.status(200).json(exhibitions.map(exhibition => extractExhibitionInfo(exhibition)));
    } else {
      res.status(204).json('Nothing found!');
    }
    next();
  });
});

router.get('/get/oneEventExhibitions/:eventName', (req = {}, res, next) => {
  if (req.params && req.params.eventName) {
    Exhibition.setDBConnection(req.app.locals.db);
    Exhibition.searchExhibitionsByEvent(req.params.eventName, (err, exhibitions) => {
      if (err) {
        console.log(err);
        res.status(500).json('Unable to fetch data!');
      } else if (exhibitions) {
        res.status(200).json(exhibitions.map(exhibition => extractExhibitionInfo(exhibition)));
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

router.get('/get/oneExhibition/:eventName/:exhibitionName', (req = {}, res, next) => {
  if (req.params && req.params.eventName && req.params.exhibitionName) {
    Exhibition.setDBConnection(req.app.locals.db);
    Exhibition.getExhibition(req.params.eventName, req.params.exhibitionName, (err, exhibition) => {
      if (err) {
        console.log(err);
        res.status(500).json('Unable to fetch data!');
      } else if (exhibition) {
        res.status(200).json(extractExhibitionInfo(exhibition));
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

router.get('/get/oneExhibitionById/:exhibitionId', (req = {}, res, next) => {
  if (req.params && req.params.exhibitionId) {
    Exhibition.setDBConnection(req.app.locals.db);
    Exhibition.getExhibitionById(req.params.exhibitionId, (err, exhibition) => {
      if (err) {
        if (err.name === 'CastError') {
          console.log(err);
          res.status(404).json('Nothing found!');
        } else {
          console.log(err);
          res.status(500).json('Unable to fetch data!');
        }
      } else if (exhibition) {
        res.status(200).json(extractExhibitionInfo(exhibition));
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

router.post('/post/search/tag', (req = {}, res, next) => {
  if (req.body && req.body.tag) {
    Exhibition.setDBConnection(req.app.locals.db);
    Exhibition.searchExhibitionsByTag(req.body.tag, (err, exhibitions) => {
      if (err) {
        if (err.name === 'ValidationError') {
          console.log(err);
          res.status(403).json('Unauthorized!');
        } else {
          console.log(err);
          res.status(500).json('Unable to post data!');
        }
      } else if (exhibitions) {
        res.status(200).json(exhibitions.map(exhibition => extractExhibitionInfo(exhibition)));
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

// The Routes below utilize Comma-Separated Strings for the second argument in the Post Request
// Use <Array>.toString() to generate a Comma-Separated String from an Array

router.post('/post/oneExhibition/set/tags', (req = {}, res, next) => {
  if (req.body && req.body.eventName && req.body.exhibitionName && req.body.tags) {
    Exhibition.setDBConnection(req.app.locals.db);
    Exhibition.setTagsForExhibition(
            req.body.eventName, req.body.exhibitionName, req.body.tags.split(','), (err, exhibition) => {
              if (err) {
                if (err.name === 'ValidationError') {
                  console.log(err);
                  res.status(403).json('Unauthorized!');
                } else {
                  console.log(err);
                  res.status(500).json('Unable to post data!');
                }
              } else if (exhibition) {
                res.status(200).json(extractExhibitionInfo(exhibition));
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

module.exports = router;
