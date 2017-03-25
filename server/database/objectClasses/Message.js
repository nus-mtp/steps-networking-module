const ModelHandler = require('../models/ourModels.js');
const removeDuplicates = require('../../utils/utils').removeDuplicates;

/**
 * This is the wrapper class used extract out and store information
 * about the Messages from the Database between view and model
 * Deletion of Message Object is not supported
 *
 */
class Message {
  /**
   * Establishes the Message Model on an existing connection.
   *
   * @param {Mongoose.Connection} db: The connection to the db.
   */
  static setDBConnection(db) {
    if (!Message.db || !Message.MessageModel) {
      Message.db = db;
      Message.MessageModel = new ModelHandler().initWithConnection(db).getMessageModel();
    }
  }

  /**
   * A function which checks whether the Database connection can be used.
   *
   * @returns {Mongoose.Connection|*|*|Aggregate|Model|boolean}
   */
  static checkConnection() {
    return (Message.db && Message.MessageModel &&
      (Message.db.readyState === 1 || Message.db.readyState === 2));
  }

  /**
   * Creates a Message JSON and stores it internally.
   *
   * @param {String} recipientEmail: The email of the User recipient.
   * @param {String} senderEmail: The email of the User sender.
   * @param {String} content: The content of the Message.
   * @param {Date} timeStamp: Date object to map when the Message was sent.
   */
  constructor(senderEmail, recipientEmail, content, timeStamp) {
    this.messageJSON = {
      recipient_email: recipientEmail,
      sender_email: senderEmail,
      messages: { content, timestamp: timeStamp },
    };
  }

  /**
   * Saves Message JSON into the Database as an actual Document.
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  saveMessage(callback) {
    if (Message.checkConnection()) {
      const messageDoc = new Message.MessageModel(this.messageJSON);
      messageDoc.save((err, result) => {
        callback(err, result);
      });
    } else {
      callback(null);
    }
  }

  /**
   * Retrieve Messages for a recipient User.
   *
   * @param {String} recipientEmail: The email of the recipient User.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static getMessagesToUser(recipientEmail, callback) {
    if (Message.checkConnection()) {
      Message.MessageModel.find({ recipient_email: recipientEmail }, (err, matchedMessages) => {
        callback(err, matchedMessages);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve Messages by a sender User.
   *
   * @param {String} senderEmail: The email of the sender User.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static getMessagesFromUser(senderEmail, callback) {
    if (Message.checkConnection()) {
      Message.MessageModel.find({ sender_email: senderEmail }, (err, matchedMessages) => {
        callback(err, matchedMessages);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve Messages that involves a certain user.
   *
   * @param {String} userEmail: The email of the targeted user.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static getEmailsInvolvingUser(userEmail, callback) {
    if (Message.checkConnection()) {
      Message.MessageModel.find(
        { $or: [{ recipient_email: userEmail },
              { sender_email: userEmail }] },
          (err, matchedMessages) => {
            const emailArray = [];
            for (let i = 0; i < matchedMessages.length; i++) {
              if (matchedMessages[i].sender_email !== userEmail) {
                emailArray.push(matchedMessages[i].sender_email);
              } else {
                emailArray.push(matchedMessages[i].recipient_email);
              }
            }
            callback(err, removeDuplicates(emailArray));
          });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve the Message sent from a recipient User to a sender User.
   *
   * @param {String} senderEmail: The email of the sender User.
   * @param {String} recipientEmail: The email of the recipient User.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static getConversation(senderEmail, recipientEmail, callback) {
    if (Message.checkConnection()) {
      const query = {
        recipient_email: recipientEmail,
        sender_email: senderEmail,
      };
      Message.MessageModel.findOne(query, (err, matchedMessage) => {
        callback(err, matchedMessage);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Add more messages to the Message.
   *
   * @param {String} senderEmail: The email of the sender User.
   * @param {String} recipientEmail: The email of the recipient User.
   * @param {String} content: message to be saved
   * @param {Date} timeStamp: Date object to map when was message sent.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static addMessage(senderEmail, recipientEmail, content, timeStamp, callback) {
    if (Message.checkConnection()) {
      const query = {
        recipient_email: recipientEmail,
        sender_email: senderEmail,
      };
      const update = { $push: { messages: { content, timestamp: timeStamp } } };
      const options = { new: true };
      Message.MessageModel.findOneAndUpdate(query, update, options, (err, results) => {
        callback(err, results);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Removes all Messages from the Database.
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static clearAllMessage(callback) {
    if (Message.checkConnection()) {
      Message.MessageModel.collection.remove({}, (err) => {
        callback(err);
      });
    } else {
      callback('Not Connected!', null);
    }
  }
}
module.exports = Message;
