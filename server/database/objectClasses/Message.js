const ModelHandler = require('../models/ourModels.js');
const removeDuplicates = require('../../utils/utils').removeDuplicates;

const config = require('../../config.json');
const currentdb = require('../../currentdb.js');

const username = config[currentdb].username;
const password = config[currentdb].password;
const host = config[currentdb].host;
const port = config[currentdb].port;
const dbName = config[currentdb].database;

/**
 * This is the wrapper class used extract out and store information
 * about the Messages from the Database between view and model
 * Deletion of Message Object is not supported
 *
 */
class Message {

  /**
   * Creates a connection to the Database.
   */
  static connectDB() {
    this.ModelHandler = new ModelHandler()
      .initWithParameters(username, password, host, port, dbName);
    this.MessageModel = this.ModelHandler.getMessageModel();
  }

  /**
   * Disconnects from the Database.
   *
   * @param {function} callback: A function to be executed upon disconnection.
   */
  static disconnectDB(callback) {
    this.ModelHandler.disconnect(callback);
  }

  /**
   * Creates a Message Document and stores it internally.
   *
   * @param {String} recipientEmail: The email of the User recipient.
   * @param {String} senderEmail: The email of the User sender.
   * @param {String} content: The content of the Message.
   * @param {Date} timeStamp: Date object to map when the Message was sent.
   */
  constructor(senderEmail, recipientEmail, content, timeStamp) {
    this.ModelHandler = new ModelHandler()
      .initWithParameters(username, password, host, port, dbName);
    this.MessageModel = this.ModelHandler.getMessageModel();
    this.messageModelDoc = new this.MessageModel({
      recipient_email: recipientEmail,
      sender_email: senderEmail,
      messages: { content, timestamp: timeStamp },
    });
    this.ModelHandler.disconnect();
  }

  /**
   * Saves Message Document stored internally into Database.
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  saveMessage(callback) {
    Message.connectDB();
    this.messageModelDoc.save((err) => {
      Message.disconnectDB(() => {
        callback(err);
      });
    });
  }

  /**
   * Retrieve Messages for a recipient User.
   *
   * @param {String} recipientEmail: The email of the recipient User.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static getMessagesToUser(recipientEmail, callback) {
    Message.connectDB();
    this.MessageModel.find({ recipient_email: recipientEmail }, (err, matchedMessages) => {
      Message.disconnectDB(() => {
        callback(err, matchedMessages);
      });
    });
  }

  /**
   * Retrieve Messages by a sender User.
   *
   * @param {String} senderEmail: The email of the sender User.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static getMessagesFromUser(senderEmail, callback) {
    Message.connectDB();
    this.MessageModel.find({ sender_email: senderEmail }, (err, matchedMessages) => {
      Message.disconnectDB(() => {
        callback(err, matchedMessages);
      });
    });
  }

  /**
   * Retrieve Messages that involves a certain user.
   *
   * @param {String} userEmail: The email of the targeted user.
   * @param {String} callback: A function that is executed once the operation is done.
   */
  static getEmailsInvolvingUser(userEmail, callback) {
    Message.connectDB();
    this.MessageModel.find({ $or: [{ recipient_email: userEmail }, { sender_email: userEmail }] }, (err, matchedMessages) => {
      Message.disconnectDB(() => {
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
    });
  }

  /**
   * Retrieve the Message sent from a recipient User to a sender User.
   *
   * @param {String} senderEmail: The email of the sender User.
   * @param {String} recipientEmail: The email of the recipient User.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static getConversation(senderEmail, recipientEmail, callback) {
    Message.connectDB();
    const query = {
      recipient_email: recipientEmail,
      sender_email: senderEmail,
    };
    this.MessageModel.findOne(query, (err, matchedMessage) => {
      Message.disconnectDB(() => {
        callback(err, matchedMessage);
      });
    });
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
    Message.connectDB();
    const query = {
      recipient_email: recipientEmail,
      sender_email: senderEmail,
    };
    const update = { $push: { messages: { content, timestamp: timeStamp } } };
    const options = { new: true };
    this.MessageModel.findOneAndUpdate(query, update, options, (err, results) => {
      Message.disconnectDB(() => {
        callback(err, results);
      });
    });
  }

  /**
   * Removes all Messages from the Database.
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static clearAllMessage(callback) {
    Message.connectDB();
    this.MessageModel.collection.remove({}, (err) => {
      Message.disconnectDB(() => {
        callback(err);
      });
    });
  }
}
module.exports = Message;
