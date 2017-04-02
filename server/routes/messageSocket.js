exports = module.exports = function(io, db) {  
  const Message = require('../database/objectClasses/Message');
  const ModelHandler = require('../database/models/ourModels');
  let ModelHandlerObj = new ModelHandler().initWithConnection(db);

  Message.setDBConnection(ModelHandlerObj.getConnection());
  var socketIDs = {};
  var userEmails = {};

  io.on('connection', (socket) => {
    socket.emit('new', {new: 'new'});
    
    socket.on('new user', (userObject, callback) => {
      if (userObject.userEmail) {
        if (userEmails[socket.id]===undefined) {
          if (socketIDs[userObject.userEmail]===undefined) {
            socketIDs[userObject.userEmail] = [];
          }
          socketIDs[userObject.userEmail].push(socket.id);
          userEmails[socket.id] = userObject.userEmail;
        }
        console.log(userObject.userEmail + ' ' + socket.id +' is connected');
        callback(socket.id);
      }
    });
    
    socket.on('get message', (messageObj, callback) => {
      //console.log(messageObj.senderEmail + ' and ' + messageObj.recipientEmail);
      if (messageObj.senderEmail && messageObj.recipientEmail) {
        Message.getConversation(messageObj.senderEmail, messageObj.recipientEmail, (err, conversation) => {
          callback(err, conversation);
        });
      } else {
        console.log('Failed to get message');
        callback('Expecting senderEmail and recipientEmail', null);
      }
    });

    socket.on('add message',(messageObj, callback) => {
      if (messageObj.senderEmail && messageObj.senderEmail && messageObj.content && callback){
        Message.addMessage(
          messageObj.senderEmail,
          messageObj.recipientEmail,
          messageObj.content,
          Date.now(),
          (err, results) => {
            if (err) {
              callback(false);
            } else if (results) {
              const socketIdList = socketIDs[messageObj.recipientEmail];
              if (socketIdList!==undefined) {
                socketIdList.forEach(function(socketId) {
                  console.log('Emitted refresh message ' + messageObj.recipientEmail + ' ' + socketId);
                  socket.to(socketId).emit('refresh message', results);
                });
              }
              callback(true);
            } else {
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
                  const socketIdList = socketIDs[messageObj.recipientEmail];
                  if (socketIdList!==undefined) {
                    socketIdList.forEach(function(socketId) {
                      console.log('Emitted new message to ' + messageObj.recipientEmail + ' ' + socketId);
                      socket.to(socketId).emit('refresh message', results);
                    });
                  }
                  callback(true);
                }
              });
            }
          });
      } else {
        callback(false);
      }
    });

    socket.on('get all emails involving user', (messageObj, callback) => {
      if (messageObj.userEmail) {
        Message.getEmailsInvolvingUser(messageObj.userEmail, (err, listOfUserEmails) => {
          if (err){
            callback('Error with getting emails method', null);
          } else {
            callback(err, listOfUserEmails);
          }
        });
      } else {
        callback('Expecting userEmail', null);
      }
    });
    
    socket.on('disconnect', () => {
      //console.log(socket.id+' is disconnected');
      const userEmail = userEmails[socket.id];
      
      // remove the socket from the list
      const socketIdList = socketIDs[userEmail];
      if (socketIdList!==undefined) {
        socketIdList.splice(socketIdList.indexOf(socket.id), 1); // remove 1 item from this position
        socketIDs[userEmail] = socketIdList;
      }
      
      delete userEmails[socket.id];
    });

  });
}
