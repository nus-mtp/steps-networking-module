const express = require('express');

const router = new express.Router();

const Message = require('../database/objectClasses/Message');

router.get('/get/getMessages/:senderEmail/:recipientEmail', (req = {}, res, next) => {
  if (req.params && req.params.senderEmail && req.params.recipientEmail) {
    Message.getConversation(req.params.senderEmail, req.params.recipientEmail, (err, msgObjs) => {
      if (err) {
        res.status(500).json('Unable to fetch data!');
      } else if (msgObjs) {
        res.status(200).json({
          sender: msgObjs.sender_email,
          receiver: msgObjs.recipient_email,
          messages: msgObjs.messages,
        });
      } else {
        res.status(404).json('Not found!');
      }  
      next();
    });
  } else {
    res.status(400).json('Bad request!');
    next();
  }
});

router.get('/get/getMessagesFrom/:senderEmail', (req = {}, res, next) => {
  if (req.params && req.params.senderEmail) {
    Message.getMessagesFromUser(req.params.senderEmail, (err, msgObjs) => {
      if (err) {
        res.status(500).json('Unable to fetch data!');
      } else if (msgObjs[0]) {
        res.status(200).json(msgObjs.map(msgObj => ({
          emails: msgObj.recipient_email,
        })));
      } else {
        res.status(404).json('Not found!');
      }
      next();
    });
  } else {
    res.status(400).json('Bad request!');
    next();
  }
});

router.get('/get/getMessagesTo/:recipientEmail', (req = {}, res, next) => {
  if (req.params && req.params.recipientEmail) {
    Message.getMessagesToUser(req.params.recipientEmail, (err, msgObjs) => {
      if (err) {
        res.status(500).json('Unable to fetch data!');
      } else if (msgObjs[0]) {
        
        res.status(200).json(msgObjs.map(msgObj => ({
          emails: msgObj.sender_email,
        })));
      } else {
        res.status(404).json('Not found!');
      }
      next();
    });
  } else {
    res.status(400).json('Bad request!');
    next();
  }
});

router.get('/get/getMessagesInvolving/:userEmail', (req = {}, res, next) => {
  if (req.params && req.params.userEmail) {
    Message.getEmailsInvolvingUser(req.params.userEmail, (err, msgObjs) => {
      if (err) {
        res.status(500).json('Unable to fetch data!');
      } else if (msgObjs[0]) {
        res.status(200).json(msgObjs);
      } else {
        res.status(404).json('Not found!');
      }
      next();
    });
  } else {
    res.status(400).json('Bad request!');
    next();
  }
});

router.post('/post/newMessage', (req = {}, res, next) => {
  if (req.body.senderEmail && req.body.recipientEmail && req.body.content){
    const newMessage = new Message(req.body.senderEmail, req.body.recipientEmail, req.body.content, Date.now());
    newMessage.saveMessage((err) => {
      if (err) {
        if ( err.code == 11000 ) {
          res.status(500).json('Message object already exists!');
        } else {
          res.status(500).json('Unable to save data!');
        }
      } else {
        res.status(200).send('Added!');
      }
      next();
    });
  } else {
    res.status(400).send('Bad request!');
    next();
  }
});

router.post('/post/addMessage', (req = {}, res, next) => {
  if (req.body.senderEmail && req.body.recipientEmail && req.body.content){
    Message.addMessage(req.body.senderEmail, req.body.recipientEmail, req.body.content, Date.now(), (err, results) => {
      if (err) {
        res.status(500).json('Unable to save data!');
        next();
      } else if (results) {
        res.status(200).send('Added!');
        next();
      } else {
        const newMessage = new Message(req.body.senderEmail, req.body.recipientEmail, req.body.content, Date.now());
        newMessage.saveMessage((err) => {
          if (err) {
            res.status(500).json('Unable to save data!');
            next();
          } else {
            res.status(200).send('New Message Object made');
            next();
          }
        });
      }
    });
  } else {
    res.status(400).send('Bad request!');
    next();
  }
});

module.exports = router;

