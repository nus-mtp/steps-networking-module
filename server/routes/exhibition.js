const express = require('express');

const router = new express.Router();

const Exhibition = require('../database/objectClasses/Exhibition');

// All Routes prefixed with 'exhibition/'

router.get('/get/oneEventExhibition/:eventName', (req = {}, res, next) => {
  Exhibition.searchExhibitionsByEvent(req.params.eventName, (err, exhibitionObjs) => {
    if (err) {
      console.log(err);
      res.status(500).json('Unable to fetch data!');
      next();
    } else if (exhibitionObjs) {
      res.status(200).json(exhibitionObjs.map(exhibitionObj => ({
        id: exhibitionObj._id,
        exhibitionName: exhibitionObj.exhibition_name,
        exhibitionDescription: exhibitionObj.exhibition_description,
        eventName: exhibitionObj.event_name,
        website: exhibitionObj.website,
        poster: exhibitionObj.poster,
        images: exhibitionObj.images,
        videos: exhibitionObj.videos,
        tags: exhibitionObj.tags,
      })));
      next();
    } else {
      res.status(404).json('Nothing found!');
      next();
    }
  });
});

router.get('/get/allExhibitions', (req = {}, res, next) => {
  Exhibition.getAllExhibitions((err, exhibitionObjs) => {
    if (err) {
      console.log(err);
      res.status(500).json('Unable to fetch data!');
      next();
    } else if (exhibitionObjs) {
      res.status(200).json(exhibitionObjs.map(exhibitionObj => ({
        id: exhibitionObj._id,
        exhibitionName: exhibitionObj.exhibition_name,
        exhibitionDescription: exhibitionObj.exhibition_description,
        eventName: exhibitionObj.event_name,
        website: exhibitionObj.website,
        poster: exhibitionObj.poster,
        images: exhibitionObj.images,
        videos: exhibitionObj.videos,
        tags: exhibitionObj.tags,
      })));
      next();
    } else {
      res.status(404).json('Nothing found!');
      next();
    }
  });
});

router.get('/get/oneExhibition/:eventName/:exhibitionName', (req = {}, res, next) => {
  console.log(req.params.exhibitionName);
  Exhibition.getExhibition(req.params.eventName, req.params.exhibitionName, (err, exhibitionObj) => {
    if (err) {
      console.log(err);
      res.status(500).json('Unable to fetch data!');
      next();
    } else if (exhibitionObj) {
      res.status(200).json({
        id: exhibitionObj._id,
        exhibitionName: exhibitionObj.exhibition_name,
        exhibitionDescription: exhibitionObj.exhibition_description,
        eventName: exhibitionObj.event_name,
        website: exhibitionObj.website,
        poster: exhibitionObj.poster,
        images: exhibitionObj.images,
        videos: exhibitionObj.videos,
        tags: exhibitionObj.tags,
      });
      next();
    } else {
      res.status(404).json('Nothing found!');
      next();
    }
  });
});


module.exports = router;
