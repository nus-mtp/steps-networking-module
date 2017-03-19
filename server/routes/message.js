const express = require('express');

const router = new express.Router();

const Message = require('../database/objectClasses/Message');

router.get('/get/getMessages/:senderEmail/:recipientEmail', (req = {}, res, next) => {
  Message.getConversation(req.params.senderEmail, req.params.recipientEmail, (err, msgObjs) => {
    if (err) {
      res.status(500).json('Unable to fetch data!');
      next();
    } else if (msgObjs) {
      res.status(200).json({
        sender: msgObjs.sender_email,
        receiver: msgObjs.recipient_email,
        messages: msgObjs.messages,
      });
      next();
    } else {
      res.status(404).json('Not found!');
    }
    next();
  });
});

router.post('/post/newMessage', (req = {}, res, next) => {
  const newMessage = new Message(req.body.senderEmail, req.body.recipientEmail, req.body.content, Date.now());
  newMessage.saveMessage((err) => {
    if (err) {
      res.status(500).json('Unable to save data!');
      next();
    } else {
      res.status(200).send('Added!');
      next();
    }
  });
});

router.post('/post/addMessage', (req = {}, res, next) => {
  Message.addMessage(req.body.senderEmail, req.body.recipientEmail, req.body.content, Date.now(), (err, results) => {
    if (err) {
      res.status(500).json('Unable to save data!');
      next();
    } else if (results) {
      res.status(200).send('Added!');
      next();
    } else {
      res.status(404).json('Message object not found!');
      next();
    }
  });
});

module.exports = router;

