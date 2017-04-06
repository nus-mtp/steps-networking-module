const express = require('express');

const router = new express.Router();

const Message = require('../database/objectClasses/Message');

const authCheckMiddleware = require('../middleware/auth-check');

router.get('/get/getMessages/:senderEmail/:recipientEmail', (req = {}, res, next) => {
  if (req.params && req.params.senderEmail && req.params.recipientEmail) {
    Message.setDBConnection(req.app.locals.db);

    Message.getConversation(req.params.senderEmail, req.params.recipientEmail, (err, msgObjs) => {
      if (err) {
        res.status(500).json(`Unable to fetch data from ${req.params.senderEmail} to ${req.params.recipientEmail}`);
      } else if (msgObjs) {
        res.status(200).json({
          sender: msgObjs.sender_email,
          receiver: msgObjs.recipient_email,
          messages: msgObjs.messages,
        });
      } else {
        res.status(204).json(`Message object from ${req.params.senderEmail} to ${req.params.recipientEmail} was not found!`);
      }
      next();
    });
  } else {
    res.status(400).json('Bad request! "recipientEmail".');
    next();
  }
});

router.get('/get/getMessagesFrom/:senderEmail', (req = {}, res, next) => {
  if (req.params && req.params.senderEmail) {
    Message.setDBConnection(req.app.locals.db);

    Message.getMessagesFromUser(req.params.senderEmail, (err, msgObjs) => {
      if (err) {
        res.status(500).json('Unable to fetch data!');
      } else if (msgObjs[0]) {
        res.status(200).json(msgObjs.map(msgObj => ({
          emails: msgObj.recipient_email,
        })));
      } else {
        res.status(204).json(`Message object from ${req.params.senderEmail} was not found!`);
      }
      next();
    });
  } else {
    res.status(400).json('Bad request! Expecting "senderEmail".');
    next();
  }
});

router.get('/get/getMessagesTo/:recipientEmail', (req = {}, res, next) => {
  if (req.params && req.params.recipientEmail) {
    Message.setDBConnection(req.app.locals.db);

    Message.getMessagesToUser(req.params.recipientEmail, (err, msgObjs) => {
      if (err) {
        res.status(500).json(`Unable to fetch data from ${req.params.recipientEmail}`);
      } else if (msgObjs[0]) {
        res.status(200).json(msgObjs.map(msgObj => ({
          emails: msgObj.sender_email,
        })));
      } else {
        res.status(204).json(`Message object to ${req.params.recipientEmail} was not found!`);
      }
      next();
    });
  } else {
    res.status(400).json('Bad request!Expecting "recipientEmail".');
    next();
  }
});

router.get('/get/getMessagesInvolving/:userEmail', (req = {}, res, next) => {
  if (req.params && req.params.userEmail) {
    Message.setDBConnection(req.app.locals.db);

    Message.getEmailsInvolvingUser(req.params.userEmail, (err, msgObjs) => {
      if (err) {
        res.status(500).json(`Unable to fetch data involving ${req.params.userEmail}`);
      } else if (msgObjs[0]) {
        res.status(200).json(msgObjs);
      } else {
        res.status(204).json(`${req.params.userEmail} not found!`);
      }
      next();
    });
  } else {
    res.status(400).json('Bad request! Expecting "userEmail".');
    next();
  }
});

router.post('/post/newMessage', (req = {}, res, next) => {
  if (req.body.senderEmail && req.body.recipientEmail && req.body.content) {
    Message.setDBConnection(req.app.locals.db);

    const newMessage = new Message(
        req.body.senderEmail,
        req.body.recipientEmail,
        req.body.content,
        Date.now());
    newMessage.saveMessage((err) => {
      if (err) {
        if (err.code === 11000) {
          res.status(500).json(`Message object from ${req.body.senderEmail} to ${req.body.recipientEmail} already exists!`);
        } else {
          res.status(500).json('Unable to save data!');
        }
      } else {
        res.status(200).send('Added!');
      }
      next();
    });
  } else {
    res.status(400).send('Bad request! Expecting "senderEmail", "recipientEmail" and "content".');
    next();
  }
});

router.post('/post/addMessage', (req = {}, res, next) => {
  if (req.body.senderEmail && req.body.recipientEmail && req.body.content) {
    Message.setDBConnection(req.app.locals.db);

    Message.addMessage(
        req.body.senderEmail,
        req.body.recipientEmail,
        req.body.content,
        Date.now(),
        (err, results) => {
          if (err) {
            res.status(500).json(`Unable to save data from ${req.body.senderEmail} to ${req.body.recipientEmail}`);
            next();
          } else if (results) {
            res.status(200).send('Added!');
            next();
          } else {
            const newMessage = new Message(
            req.body.senderEmail,
            req.body.recipientEmail,
            req.body.content,
            Date.now());
            newMessage.saveMessage((err) => {
              if (err) {
                res.status(500).json(`Unable to save data from${req.body.senderEmail} to ${req.body.recipientEmail}`);
                next();
              } else {
                res.status(200).send('New Message Object made');
                next();
              }
            });
          }
        });
  } else {
    res.status(400).send('Bad request! Expecting "senderEmail", "recipientEmail" and "content".');
    next();
  }
});

module.exports = router;

