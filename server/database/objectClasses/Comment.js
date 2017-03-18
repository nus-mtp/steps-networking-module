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
 * about the comments from the Database between view and model
 *
 */
class Comment {
  /**
   * Creates a connection to the Database
   */
  static connectDB() {
    this.ModelHandler = new ModelHandler()
        .initWithParameters(username, password, host, port, dbName);
    this.CommentModel = this.ModelHandler.getCommentModel();
  }

  /**
   * Disconnect from database
   */
  static disconnectDB() {
    this.ModelHandler.disconnect();
  }

  /**
   * Creates a Comment Document and stores it internally.
   *
   * @param {String} userEmail: The email of the User that made the Comment.
   * @param {String} exhibitionName: The name of Exhibition with the Comment.
   * @param {String} comment: The content of the Comment.
   * @param {Date} date: date object to indicate when the Comment was made.
   */
  constructor(userEmail, exhibitionName, comment, date) {
    this.ModelHandler = new ModelHandler()
        .initWithParameters(username, password, host, port, dbName);
    this.CommentModel = this.ModelHandler.getCommentModel();
    this.commentModelDoc = new this.CommentModel({
      user_email: userEmail,
      exhibition: exhibitionName,
      comments: { content: comment, timestamp: date },
    });
    this.ModelHandler.disconnect();
  }

  /**
   * Saves the Comment Document into the Database.
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  saveComment(callback) {
    Comment.connectDB();
    this.commentModelDoc.save((err) => {
      Comment.disconnectDB();
      callback(err);
    });
  }

  /**
   * Adds a Comment made by a specific User of a Comment Document.
   *
   * @param {String} userEmail: User that made the Comment.
   * @param {String} exhibitionName: name of exhibition with the Comment.
   * @param {String} comment: string content of the Comment.
   * @param {Date} date: date object to indicate when the Comment is made.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static addCommentForExhibition(userEmail, exhibitionName, comment, date, callback) {
    Comment.connectDB();
    const query = {
      user_email: userEmail,
      exhibition: exhibitionName,
    };
    const update = { $push: { comments: { content: comment, timestamp: date } } };
    const options = { new: true };
    this.CommentModel.findOneAndUpdate(query, update, options, (err, results) => {
      Comment.disconnectDB();
      callback(err, results);
    });
  }

  /**
   * Retrieve list of Comments for a specific Exhibition
   *
   * @param {String} exhibitionName: name of Exhibition to retrieve Comments for.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static getCommentsForExhibition(exhibitionName, callback) {
    Comment.connectDB();
    this.CommentModel.find({ exhibition: exhibitionName }, (err, matchedComments) => {
      Comment.disconnectDB();
      callback(err, matchedComments);
    });
  }

  /**
   * Removes Comments for a specific Exhibition
   *
   * @param {String} exhibitionName: name of Exhibition to clear Comments from.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static clearCommentsForExhibition(exhibitionName, callback) {
    Comment.connectDB();
    this.CommentModel.find({ exhibition_name: exhibitionName }).remove().exec((err, results) => {
      Comment.disconnectDB();
      callback(err, results);
    });
  }

  /**
   * Removes all Comments from the Database
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static clearAllComment(callback) {
    Comment.connectDB();
    this.CommentModel.collection.remove({}, (err) => {
      Comment.disconnectDB();
      callback(err);
    });
  }

}
module.exports = Comment;
