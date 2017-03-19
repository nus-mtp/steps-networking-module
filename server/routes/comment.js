const express = require('express');

const router = new express.Router();

const Comment = require('../database/objectClasses/Comment.js');

router.post('/post/newComment', (req = {}, res, next) => {
  const newComment = new Comment(
      req.body.userEmail, req.body.exhibitionName, req.body.comment, Date.now());
  newComment.saveComment((err) => {
    if (err) {
      res.status(500).json('Unable to save data!');
      next();
    } else {
      res.status(200).send('Added');
      next();
    }
  });
});

router.post('/post/addComment', (req = {}, res, next) => {
  Comment.addCommentForExhibition(
      req.body.userEmail, req.body.exhibitionName, req.body.comment, Date.now(), (err, results) => {
        if (err) {
          res.status(500).json('Unable to fetch data!');
          next();
        } else if (results) {
          res.status(200).send('Added');
          next();
        } else {
          res.status(404).json('Comment object not found!');
          next();
        }
      });
});

module.exports = router;
