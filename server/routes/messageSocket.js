exports = module.exports = function (io, db) {
  const Message = require('../database/objectClasses/Message');
  const User = require('../database/objectClasses/User');
  const ModelHandler = require('../database/models/ourModels');
  const removeDuplicates = require('../utils/utils').removeDuplicates;
  const jwt = require('jsonwebtoken');

  const ModelHandlerObj = new ModelHandler().initWithConnection(db);

  Message.setDBConnection(ModelHandlerObj.getConnection());
  User.setDBConnection(ModelHandlerObj.getConnection());
  const socketIDs = {};
  const userEmails = {};

  // Authorize
  const verify = (token, callback) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return callback(false);
      }
      const userModel = ModelHandlerObj.getUserModel();
      const userId = decoded.sub;

      // check if a user exists in database
      userModel.findById(userId, (userErr, user) => {
        if (userErr || !user) {
          return callback(false);
        }
        return callback(true);
      });
    });
  };

  io.on('connection', (socket) => {
    socket.on('new user', (userObject, callback) => {
      if (userObject.userEmail) {
        if (userEmails[socket.id] === undefined) {
          if (socketIDs[userObject.userEmail] === undefined) {
            socketIDs[userObject.userEmail] = [];
          }
          socketIDs[userObject.userEmail].push(socket.id);
          userEmails[socket.id] = userObject.userEmail;
        }
        callback(socket.id);
      } else {
        callback(null);
      }
    });


    socket.on('get all emails involving user', (messageObj, callback) => {
      if (messageObj.userEmail) {
        Message.getEmailsInvolvingUser(messageObj.userEmail, (err, listOfUserEmails) => {
          if (err) {
            callback('Error with getting emails method', null);
          } else {
            // add email list of bookmarked users into the returned emails
            User.getBookmarksForUser(messageObj.userEmail, (err, userList) => {
              for (let i = 0; i < userList.length; i++) {
                listOfUserEmails.push(userList[i].email);
              }
              callback(err, removeDuplicates(listOfUserEmails));
            });
          }
        });
      } else {
        callback('Expecting userEmail', null);
      }
    });

    socket.on('get message', (messageObj, token, callback) => {
      if (messageObj.senderEmail && messageObj.recipientEmail && token) {
        if (token) {
          verify(token.token, (success) => {
            if (success) {
              Message.getConversation(messageObj.senderEmail, messageObj.recipientEmail, (err, conversation) => {
                callback(err, conversation);
              });
            }
          });
        } else {
          callback('Unauthorized', null);
        }
      } else {
        // Failed to get message
        callback('Expecting senderEmail, recipientEmail and token', null);
      }
    });

    socket.on('add message', (messageObj, token, callback) => {
      if (messageObj.senderEmail && messageObj.recipientEmail && messageObj.content && token) {
        if (token) {
          verify(token.token, (success) => {
            if (success) {
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
                    if (socketIdList !== undefined) {
                      socketIdList.forEach((socketId) => {
                        // Emit refresh message
                        socket.to(socketId).emit('refresh message', results);
                      });
                    }
                    const userSocketIdList = socketIDs[messageObj.senderEmail];
                    // if sender is using more than one opened tab
                    if (userSocketIdList.length > 1) {
                      userSocketIdList.forEach((socketId) => {
                        // Emit refresh message
                        socket.to(socketId).emit('refresh message', results);
                      });
                    }
                    callback(true);
                  } else {
                    // A new message is created if there's isnt any
                    const newMessage = new Message(
                      messageObj.senderEmail,
                      messageObj.recipientEmail,
                      messageObj.content,
                      Date.now(),
                    );
                    newMessage.saveMessage((err) => {
                      if (err) {
                        callback(false);
                      } else {
                        const socketIdList = socketIDs[messageObj.recipientEmail];
                        if (socketIdList !== undefined) {
                          socketIdList.forEach((socketId) => {
                            // Emit refresh message
                            socket.to(socketId).emit('refresh message', results);
                          });
                        }
                        const userSocketIdList = socketIDs[messageObj.senderEmail];
                        // if sender is using more than one opened tab
                        if (userSocketIdList.length > 1) {
                          userSocketIdList.forEach((socketId) => {
                            // Emit refresh message
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
        }
      } else {
        callback(false);
      }
    });

    // removes user from socketIDs and userEmails
    socket.on('remove user', () => {
      // user is disconnected
      const userEmail = userEmails[socket.id];

      // remove the socket from the list
      const socketIdList = socketIDs[userEmail];
      if (socketIdList !== undefined) {
        socketIdList.splice(socketIdList.indexOf(socket.id), 1); // remove 1 item from this position
        socketIDs[userEmail] = socketIdList;
      }

      delete userEmails[socket.id];
    });

    // Will close the entire socket. Only called when user close the tab
    socket.on('disconnect', () => {
      // user is disconnected
      const userEmail = userEmails[socket.id];
      // remove the socket from the list
      const socketIdList = socketIDs[userEmail];
      if (socketIdList !== undefined) {
        socketIdList.splice(socketIdList.indexOf(socket.id), 1); // remove 1 item from this position
        socketIDs[userEmail] = socketIdList;
      }
      delete userEmails[socket.id];
    });
  });
};
