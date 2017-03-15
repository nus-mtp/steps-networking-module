const ModelHandler = require('../../../server/database/models/ourModels.js');

const port = '27017';
const host = 'localhost';
const dbName = 'dev';
const username = '';
const password = '';

/**
 * This is the wrapper class used extract out and store information
 * about the Messages from the database between view and model
 * Users are not allowed to delete the Message Object
 *
 */
class Message{

  /**
   * Creates a Message model instance.
   *
   * @param {String} recipientEmail: Email string of receiver
   * @param {String} senderEmail: Email string of sender
   * @param {String} content: message to be saved
   * @param {Date} timeStamp: Date object to map when was message sent
   */
  constructor(recipientEmail, senderEmail, content, timestamp) {
    this.ModelHandler = new ModelHandler().initWithParameters(username, password, host, port, dbName);
    this.MessageModel = this.ModelHandler.getMessageModel();
    this.messageModelDoc = new this.MessageModel({
      recipient_email: recipientEmail,
      sender_email: senderEmail,
      content: content,
      timestamp: timestamp,
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
   * Add more elements into the message
   *
   * @param {String} recipientEmail: Email string of receiver
   * @param {String} senderEmail: Email string of sender
   * @param {String} content: message to be saved
   * @param {Date} timeStamp: Date object to map when was message sent
   */
  static addMessage(recipientEmail, senderEmail, content, timestamp, callback) { //yet to test
    Message.connectDB();
    const query = {
      recipient_email: recipientEmail,
      sender_email: senderEmail,
    };
    const update = {$push: { content: content, timestamp: timestamp } };
    const options = { new: true };
    this.MessageModel.findOne(query, update, options, function cb(err, results) {
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
