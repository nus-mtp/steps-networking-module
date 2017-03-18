const express = require('express');
const router = new express.Router();
const Message = require ('../database/objectClasses/Message.js');

router.get('/get/getMessages/:senderEmail/:recipientEmail', (req = {}, res, next) => {

  Message.getConversation(req.params.senderEmail, req.params.recipientEmail, function (err, msgObjs){
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
  });
});

router.post('/post/newMessage',(req = {}, res, next) => {
  const newMessage = new Message (req.body.senderEmail, req.body.recipientEmail, req.body.content, Date.now());
  newMessage.saveMessage((err)=>{
    if (err) {
      res.status(500).json('Unable to fetch data!');
    } else {
      res.status(200).send('Added');
    }
  });
});

router.post('/post/addMessage', (req = {}, res, next) => {
  Message.addMessage(req.body.senderEmail, req.body.recipientEmail, req.body.content, Date.now(), (err, results) => {
    if (err) {
      res.status(500).json('Unable to fetch data!');
    } else if (results){
      res.status(200).send('Added');
    } else {
      res.status(404).json('Message object not found!');
    }
  });
});

module.exports = router;

