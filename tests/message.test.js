const Message = require("../app/database/objectClasses/Message.js");
const assert = require('assert');

describe('Message Create', function(){
  before(function(done) {
    var testmessage1 = new Message('user2@user.com',
                                   'user1@user.com',
                                   'HELLO!',
                                   new Date('October 14, 2014 21:00:00'),
                                  );

    testmessage1.saveMessage(function callback(err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after (function(done) {
    Message.clearAllMessage(function cb(err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  it('should be able to add a new message object', function(done){
    var testmessage2 = new Message('user1@user.com',
                                   'user2@user.com',
                                   'Hi!',
                                   new Date('October 14, 2014 21:01:00'),
                                  );
    testmessage2.saveMessage(function callback(err) {
      if (err) {
        console.log(err);
      }
      // check that its inside the databse
      Message.getMessageFromUser('user1@user.com', function cb(err, messageObj){
        if (err){
          console.log("error with getting message from user");
        } else {
          assert.equal(messageObj[0].messages[0].content, 'Hi!');
        }
      });
      done();
    });
  });
});

describe('Message Read', function(){
  before(function(done) {
    var testmessage1 = new Message('user4@user.com',
                                   'user3@user.com',
                                   'Dammit',
                                   new Date('October 14, 2014 21:00:00'),
                                  );

    testmessage1.saveMessage(function callback(err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after (function(done) {
    Message.clearAllMessage(function cb(err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });
  it('should be able to read message FROM a specified user TO another specified user', function (done){
    Message.getConversation('user4@user.com', 'user3@user.com', function cb(err, msgObj){
      if (err){
        console.log("can't get existing message");
      } else {
        assert.equal(msgObj.messages[0].content, 'Dammit');
      }
      done();
    });
  });
  it('should be able to read message FROM a specified user', function (done){
    Message.getMessageFromUser('user4@user.com', function cb(err, msgObj){
      if (err){
        console.log("can't get existing message");
      } else {
        assert.equal(msgObj[0].messages[0].content, 'Dammit');
      }
      done();
    });
  });

  it('should be able to read message TO a specified user', function (){
    Message.getMessageForUser('user3@user.com', function cb(err, msgObj){
      if (err){
        console.log("can't get existing message");
      } else {
        assert.equal(msgObj[0].messages[0].content, 'Dammit');
      }
    });
  });

  it('should not be able to read message with a non-existant user', function (){
    Message.getMessageForUser('user5@user.com', function cb(err, msgObj){
      if (err){
        console.log("can't get existing message");
      } else {
        assert.equal(msgObj[0], null);
      }
    });
  });
});

describe('Message Update', function(){
  before(function(done) {
    var testmessage1 = new Message('user4@user.com',
                                   'user3@user.com',
                                   'Dammit',
                                   new Date('October 14, 2014 21:00:00'),
                                  );

    testmessage1.saveMessage(function callback(err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after (function(done) {
    Message.clearAllMessage(function cb(err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  it ('should be able to append more messages into the object', function(){
    Message.addMessage(
      'user4@user.com',
      'user3@user.com',
      'Are you serious?!',
      new Date('October 15, 2014 21:00:00'),
      function cb(err, results){
        if (err){
          console.log (err);
        } else {
          assert.equal(results.messages[1].content, 'Are you serious?!');
        }
      }
    );
  });
});