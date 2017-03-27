const config = require('../server/config.json').fakeDbUri;
const ModelHandler = require('../server/database/models/ourModels');
const Message = require('../server/database/objectClasses/Message.js');
const assert = require('assert');

let ModelHandlerObj;
describe('Message Create', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithParameters(
        config.username,
        config.password,
        config.host,
        config.port,
        config.database);

    Message.setDBConnection(ModelHandlerObj.getConnection());

    const testmessage1 = new Message('user2@user.com',
                                   'user1@user.com',
                                   'HELLO!',
                                   new Date('October 14, 2014 21:00:00'),
                                  );

    testmessage1.saveMessage((err) => {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after((done) => {
    Message.clearAllMessage((err) => {
      if (err) {
        console.log(err);
      }
      ModelHandlerObj.disconnect(() => {
        done();
      });
    });
  });

  it('should be able to add a new message object', (done) => {
    const testmessage2 = new Message('user1@user.com',
                                   'user2@user.com',
                                   'Hi!',
                                   new Date('October 14, 2014 21:01:00'),
                                  );
    testmessage2.saveMessage((err) => {
      if (err) {
        console.log(err);
      }
      // check that its inside the databse
      Message.getMessagesFromUser('user1@user.com', (err, msgObj) => {
        if (err) {
          console.log('error with getting message from user');
        } else {
          assert.equal(msgObj[0].messages[0].content, 'Hi!');
        }
        done();
      });
    });
  });
});

describe('Message Read', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithParameters(
        config.username,
        config.password,
        config.host,
        config.port,
        config.database);

    Message.setDBConnection(ModelHandlerObj.getConnection());

    const testmessage1 = new Message('user4@user.com',
                                   'user3@user.com',
                                   'Dammit',
                                   new Date('October 14, 2014 21:00:00'),
                                  );

    testmessage1.saveMessage((err) => {
      if (err) {
        console.log(err);
      }
      const testmessage2 = new Message('user3@user.com',
                                     'user1@user.com',
                                     'okay can.',
                                     new Date('October 14, 2014 21:00:00'),
                                    );
      testmessage2.saveMessage((err) => {
        if (err) {
          console.log(err);
        }
        done();
      });
    });
  });

  after((done) => {
    Message.clearAllMessage((err) => {
      if (err) {
        console.log(err);
      }
      ModelHandlerObj.disconnect(() => {
        done();
      });
    });
  });

  it('should be able to get all messages involving a specific user', (done) => {
    Message.getEmailsInvolvingUser('user3@user.com', (err, msgObj) => {
      console.log(msgObj);
      if (err) {
        console.log('unable to get message');
        console.log(err);
      } else {
        assert.notEqual(msgObj[0], null);
      }
      done();
    });
  });

  it('should be able to read message FROM a specified user TO another specified user', (done) => {
    Message.getConversation('user4@user.com', 'user3@user.com', (err, msgObj) => {
      if (err) {
        console.log("can't get existing message");
      } else {
        assert.equal(msgObj.messages[0].content, 'Dammit');
      }
      done();
    });
  });

  it('should be able to read message FROM a specified user', (done) => {
    Message.getMessagesFromUser('user4@user.com', (err, msgObj) => {
      if (err) {
        console.log("can't get existing message");
      } else {
        assert.equal(msgObj[0].messages[0].content, 'Dammit');
      }
      done();
    });
  });

  it('should be able to read message TO a specified user', (done) => {
    Message.getMessagesToUser('user3@user.com', (err, msgObj) => {
      if (err) {
        console.log("can't get existing message");
      } else {
        assert.equal(msgObj[0].messages[0].content, 'Dammit');
      }
      done();
    });
  });

  it('should not be able to read message with a non-existant user', (done) => {
    Message.getMessagesToUser('user5@user.com', (err, msgObj) => {
      if (err) {
        console.log("can't get existing message");
      } else {
        assert.equal(msgObj[0], null);
      }
      done();
    });
  });
});

describe('Message Update', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithParameters(
        config.username,
        config.password,
        config.host,
        config.port,
        config.database);

    Message.setDBConnection(ModelHandlerObj.getConnection());

    const testmessage1 = new Message('user4@user.com',
                                   'user3@user.com',
                                   'Dammit',
                                   new Date('October 14, 2014 21:00:00'),
                                  );

    testmessage1.saveMessage((err) => {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after((done) => {
    Message.clearAllMessage((err) => {
      if (err) {
        console.log(err);
      }
      ModelHandlerObj.disconnect(() => {
        done();
      });
    });
  });

  it('should be able to append more messages into the object', (done) => {
    Message.addMessage(
      'user4@user.com',
      'user3@user.com',
      'Are you serious?!',
      new Date('October 15, 2014 21:00:00'),
      (err, results) => {
        if (err) {
          console.log(err);
        } else {
          assert.equal(results.messages[1].content, 'Are you serious?!');
        }
        done();
      },
    );
  });
});
