exports = module.exports = function(io, db) {  
  const Message = require('../database/objectClasses/Message');
  const ModelHandler = require('../database/models/ourModels');
  let ModelHandlerObj = new ModelHandler().initWithConnection(db);

  Message.setDBConnection(ModelHandlerObj.getConnection());
  var socketIDs = {};

  io.on('connection', (socket) => {
    socket.emit('new', {new: 'new'});
    socket.on('get message', (messageObj, callback) => {
      console.log(messageObj.senderEmail+' and '+messageObj.recipientEmail);
      if (messageObj.senderEmail && messageObj.recipientEmail) {
        socketIDs[messageObj.senderEmail] = socket;
        Message.getConversation(messageObj.senderEmail, messageObj.recipientEmail, (err, conversation) => {
          console.log(conversation);
          callback(err, conversation);
        });
      } else {
        console.log('fail');
        callback('Expecting senderEmail and recipientEmail', null);
      }
    });

    socket.on('add message',(messageObj, callback) => {
      if (messageObj.senderEmail && messageObj.senderEmail && messageObj.content && callback){
        console.log('in new message: '+ messageObj.content);
        Message.addMessage(
          messageObj.senderEmail,
          messageObj.recipientEmail,
          messageObj.content,
          Date.now(),
          (err, results) => {
            if (err) {
              callback(false);
            } else if (results) {
              socketIDs[messageObj.senderEmail].emit('refresh message', results);
              callback(true);
            } else {
              socketIDs[messageObj.senderEmail] = socket;
              const newMessage = new Message(
                messageObj.senderEmail,
                messageObj.recipientEmail,
                messageObj.content,
                Date.now()
              );
              newMessage.saveMessage((err) => {
                if (err) {
                  callback(false);
                } else {
                  socketIDs[messageObj.senderEmail].emit('refresh message', results);
                  callback(true);
                }
              });
            }
          });
      } else {
        callback(false);
      }
    });

    socket.on('get message involving user', (messageObj, callback) => {
      if (messageObj.userEmail) {
        Message.getEmailsInvolvingUser(messageObj.userEmail, (err, msgObjs) => {
          if (err){
            callback('Error with getting emails method', null);
          } else {
            callback(err, msgObjs);
          }
        });
      } else {
        callback('Expecting userEmail', null);
      }
    });

  });
}
