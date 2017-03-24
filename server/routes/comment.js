const express = require('express');

const router = new express.Router();

const extractCommentInfo = require('../utils/utils').extractCommentInfo;

const Comment = require('../database/objectClasses/Comment');

const Exhibition = require('../database/objectClasses/Exhibition');

router.get('/get/userComments/:eventName/:exhibitionName/:userEmail', (req = {}, res, next) => {
  Exhibition.getExhibition(req.params.eventName, req.params.exhibitionName, (err, result) => {
    if (err) {
      res.status(500).json('Unable to fetch' + req.params.exhibitionName);
    } else if (result){
      Comment.getUserCommentsForExhibition(req.params.userEmail, result._id, (err, commentObj) => {
        if (err) {
          res.status(500).json('unable to fetch Comment object for '+ req.params.userEmail);
        } else if (commentObj) {
          res.status(200).json(extractCommentInfo(commentObj));
        } else {
          res.status(404).json('Comment object not found for '+req.params.userEmail);
        }
      });
    } else {
      res.status(404).json('unable to find '+req.params.exhibitionName+ ' object');
    }
  });
});

router.get('/get/:eventName/:exhibitionName', (req = {}, res, next) => {
  Exhibition.getExhibition(req.params.eventName, req.params.exhibitionName, (err, result) => {
    if (err) {
      res.status(500).json('Unable to fetch' + req.params.exhibitionName);
    } else if (result){
      Comment.getCommentsForExhibition(result._id, (err, commentObjs) => {
        if (err) {
          res.status(500).json('unable to fetch Comment object for '+ req.params.userEmail);
        } else if (commentObjs) {
          res.status(200).json(commentObjs.map(commentObj => extractCommentInfo(commentObj)));
        } else {
          res.status(404).json('Comment object not found for '+req.params.userEmail);
        }
      });
    } else {
      res.status(404).json('unable to find '+req.params.exhibitionName+ ' object');
    }
  });
});

router.post('/post/newComment', (req = {}, res, next) => {
  if (req.body && req.body.eventName && req.body.exhibitionName && req.body.userEmail && req.body.comment){
    Exhibition.getExhibition(req.body.eventName, req.body.exhibitionName, (err, results) => {
      if (err) {
        res.status(500).json('Unable to fetch the exhibition id');
      } else if (results) {
        const newComment = new Comment(
          req.body.userEmail, results._id, req.body.comment, Date.now());
        newComment.saveComment((err) => {
          if (err) {
            res.status(500).json('Unable to save data!');
            next();
          } else {
            res.status(200).json('Added');
            next();
          }
        });
      } else {
        res.status(404).json('Unable to find ' + req.body.exhibitionName + ' object');
      }
    });
  } else {
    res.status(400).json('Bad request! Expecting "exhibitionName", "eventName", "userEmail" and "comment"');
  }
});

router.post('/post/addComment', (req = {}, res, next) => {
  if (req.body && req.body.exhibitionName && req.body.eventName && req.body.userEmail && req.body.comment){
    Exhibition.getExhibition(req.body.eventName, req.body.exhibitionName, (err, results) => {
      if (err) {
        res.status(500).json('Unable to fetch the exhibition id');
      } else if (results) {
        Comment.addCommentForExhibition(req.body.userEmail, results._id, req.body.comment, Date.now(), (err, results) => {
          if (err) {
            res.status(500).json('Unable to fetch Comment object for ' + req.body.exhibitionName);
            next();
          } else if (results) {
            res.status(200).json('Added');
            next();
          } else {
            res.status(404).json('Comment object not found!');
            next();
          }
        });
      } else {
        res.status(404).json('Unable to find ' + req.body.exhibitionName + ' object');
      }
    });
  } else {
    res.status(400).json('Bad request! Expecting "exhibitionName", "eventName", "userEmail" and "comment"');
  }
});

module.exports = router;
