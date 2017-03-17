const ModelHandler = require('../models/ourModels.js');

const config = require('../../config.json');
const currentdb = require('../../currentdb.js');

const username = config[currentdb].username;
const password = config[currentdb].password;
const host = config[currentdb].host;
const port = config[currentdb].port;
const dbName = config[currentdb].database;

/**
 * This is the wrapper class used extract out and store information
 * about the Messages from the database between view and model
 * Deletion of Message Object is not supported
 *
 */
class Message {

  /**
   * Creates a Message model instance.
   *
   * @param {String} recipientEmail: Email string of receiver
   * @param {String} senderEmail: Email string of sender
   * @param {String} content: message to be saved
   * @param {Date} timeStamp: Date object to map when was message sent
   */
  constructor(senderEmail, recipientEmail, content, timestamp) {
    this.ModelHandler = new ModelHandler().initWithParameters(username, password, host, port, dbName);
    this.MessageModel = this.ModelHandler.getMessageModel();
    this.messageModelDoc = new this.MessageModel({
      recipient_email: recipientEmail,
      sender_email: senderEmail,
      messages:  { content: content ,  timestamp: timestamp } ,
    });
    this.ModelHandler.disconnect();
  }

  /**
   * saves message into Database
   *
   * @param {function} callback: used for error checking
   */
  saveMessage(callback) {
    Message.connectDB();
    this.messageModelDoc.save(function cb(err) {
      callback(err);
    });
    Message.disconnectDB();
  }

  static connectDB() {
    this.ModelHandler = new ModelHandler().initWithParameters(username, password, host, port, dbName);
    this.MessageModel = this.ModelHandler.getMessageModel();
  }

  static disconnectDB() {
    this.ModelHandler.disconnect();
  }

  /**
   * Removes all messages from the Database
   *
   * @param {function} callback: used for error checking
   */
  static clearAllMessage(callback) {
    Message.connectDB();
    this.MessageModel.collection.remove({}, callback);
    Message.disconnectDB();
  }

  /**
   * Retrieve Message by recipients
   *
   * @param {String} senderEmail: Email string of receiver
   * @param {Function} callback: Used for error checking and storing of Message Array
   */
  static getMessageForUser(recipientEmail, callback) {
    Message.connectDB();
    this.MessageModel.find({ recipient_email: recipientEmail }, callback);
    Message.disconnectDB();
  }

  /**
   * Retrieve Message by sender
   *
   * @param {String} senderEmail: Email string of sender
   * @param {Function} callback: Used for error checking and storing of Message Array
   */
  static getMessageFromUser(senderEmail, callback) {
    Message.connectDB();
    this.MessageModel.find({ sender_email: senderEmail }, callback);
    Message.disconnectDB();
  }

  /**
   * Retrieve the messages sent by sender to recipient
   *
   * @param {String} senderEmail: Email string of sender
   * @param {String} senderEmail: Email string of receiver
   * @param {Function} callback: Used for error checking and storing of Message Array
   */
  static getConversation(senderEmail, recipientEmail, callback) {
    Message.connectDB();
    const query = {
      recipient_email: recipientEmail,
      sender_email: senderEmail,
    };
    this.MessageModel.findOne({ sender_email: senderEmail }, callback);
    Message.disconnectDB();
  }

  /**
   * Add more elements into the message
   *
   * @param {String} recipientEmail: Email string of receiver
   * @param {String} senderEmail: Email string of sender
   * @param {String} content: message to be saved
   * @param {Date} timeStamp: Date object to map when was message sent
   */
  static addMessage(senderEmail, recipientEmail, content, timestamp, callback) {
    Message.connectDB();
    const query = {
      recipient_email: recipientEmail,
      sender_email: senderEmail,
    };
    const update = { $push: { messages: { content: content,  timestamp: timestamp }}};
    const options = { new: true };
    this.MessageModel.findOneAndUpdate(query, update, options, function cb(err, results) {
      if (err) {
        callback(err, null);
      } else {if (results) {
        callback(null, results);
      } else {
        callback(null, null);
      }}
    });
    Message.disconnectDB();
  }
}
module.exports = Message;
