const express = require('express');

const router = new express.Router();

const Exhibition = require('../database/objectClasses/Exhibition');

/**
 * Extracts out relevant information from a supplied Exhibition Document.
 *
 * @param {Mongoose.Document} exhibition:
 *    The Exhibition document returned from a Exhibition objectClass method.
 * @returns {{id, exhibitionName, exhibitionDescription: (*|string|String|string), eventName, website: (*|String), poster: (*|number|String|string), images: (*|Array|HTMLCollection), videos: (*|Array), tags}}
 */
function extractExhibitionInfo(exhibition) {
  return {
    id: exhibition._id,
    exhibitionName: exhibition.exhibition_name,
    exhibitionDescription: exhibition.exhibition_description,
    eventName: exhibition.event_name,
    website: exhibition.website,
    poster: exhibition.poster,
    images: exhibition.images,
    videos: exhibition.videos,
    tags: exhibition.tags,
  };
}

// All Routes prefixed with 'exhibition/'

router.get('/get/oneEventExhibitions/:eventName', (req = {}, res, next) => {
  if (req.params && req.params.eventName) {
    Exhibition.searchExhibitionsByEvent(req.params.eventName, (err, exhibitions) => {
      if (err) {
        console.log(err);
        res.status(500).json('Unable to fetch data!');
        next();
      } else if (exhibitions) {
        res.status(200).json(exhibitions.map(exhibition => extractExhibitionInfo(exhibition)));
        next();
      } else {
        res.status(404).json('Nothing found!');
        next();
      }
    });
  } else {
    res.status(400).json('Bad Request!');
  }
});

router.get('/get/allExhibitions', (req = {}, res, next) => {
  Exhibition.getAllExhibitions((err, exhibitions) => {
    if (err) {
      console.log(err);
      res.status(500).json('Unable to fetch data!');
      next();
    } else if (exhibitions) {
      res.status(200).json(exhibitions.map(exhibition => extractExhibitionInfo(exhibition)));
      next();
    } else {
      res.status(404).json('Nothing found!');
      next();
    }
  });
});

router.get('/get/oneExhibition/:eventName/:exhibitionName', (req = {}, res, next) => {
  Exhibition.getExhibition(req.params.eventName, req.params.exhibitionName, (err, exhibition) => {
    if (err) {
      console.log(err);
      res.status(500).json('Unable to fetch data!');
      next();
    } else if (exhibition) {
      res.status(200).json(extractExhibitionInfo(exhibition));
      next();
    } else {
      res.status(404).json('Nothing found!');
      next();
    }
  });
});

// The Routes below utilize Comma-Separated Strings for the second argument in the Post Request
// Use <Array>.toString() to generate a Comma-Separated String from an Array

router.post('/post/oneExhibition/set/tags', (req = {}, res, next) => {
  if (req.body && req.body.eventName && req.body.exhibitionName && req.body.tags) {
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
