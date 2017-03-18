const express = require('express');
const router = new express.Router();
const Comment = require ('../database/objectClasses/Comment.js');


router.post('/post/newComment',(req = {}, res, next) => {
  const newComment = new Comment (req.body.userEmail, req.body.exhibitionName, req.body.comment, Date.now());
  newComment.saveComment((err)=>{
    if (err) {
      res.status(500).json('Unable to fetch data!');
    } else {
      res.status(200).send('Added');
    }
  });
});

router.post('/post/addComment', (req = {}, res, next) => {
  Comment.addCommentForExhibition(req.body.userEmail, req.body.exhibitionName, req.body.comment, Date.now(), (err, results) => {
    if (err) {
      res.status(500).json('Unable to fetch data!');
    } else if (results){
      res.status(200).send('Added');
    } else {
      res.status(404).json('Comment object not found!');
    }
  });
});

module.exports = router;
