const express = require('express');
const router = new express.Router();

const Exhibition = require('../database/objectClasses/Exhibition');

import currentdb from '../currentdb';
const config = require('../config.json');
const ModelHandler = require('../database/models/ourModels');

// All Routes prefixed with 'exhibition/'

router.get('/get/allExhibitions', (req = {}, res, next) => {
  Exhibition.getAllExhibition((err, exhibitionObjs) => {
    if (err) {
      console.log(err);
      res.status(500).json('Unable to fetch data!');
      next();
    } else if (exhibitionObjs) {
      res.status(200).json(exhibitionObjs.map(exhibitonObj => ({
        exhibitionName: exhibitonObj.exhibition_name,
        exhibitionDescription: exhibitonObj.exhibition_description,
        eventName: exhibitonObj.event_name,
        website: exhibitonObj.website,
        poster: exhibitonObj.poster,
        images: exhibitonObj.images,
        videos: exhibitonObj.videos,
        tags: exhibitonObj.tags,
      })));
      next();
    } else {
      res.status(404).json('Nothing found!');
      next();
    }
  });
});

module.exports = router;
