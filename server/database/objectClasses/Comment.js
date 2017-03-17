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
 * about the comments from the database between view and model
 *
 */
class Comment {

  /**
   * Creates a connection to the database
   */
  static connectDB() {
    this.ModelHandler = new ModelHandler().initWithParameters(username, password, host, port, dbName);
    this.CommentModel = this.ModelHandler.getCommentModel();
  }

  /**
   * Disconnect from database
   */
  static disconnectDB() {
    this.ModelHandler.disconnect();
  }

  /**
   * Creates a Comment model instance
   *
   * @param {String} userEmail: User that made the comment
   * @param {String} exhibitionName: name of exhibition with the comment
   * @param {String} comment: string content of the comment
   * @param {Date} date: date object to indicate when the comment is made 
   */
  constructor(userEmail, exhibitionName, comment, date) {
    this.ModelHandler = new ModelHandler().initWithParameters(username, password, host, port, dbName);
    this.CommentModel = this.ModelHandler.getCommentModel();
    this.commentModelDoc = new this.CommentModel({
      user_email: userEmail,
      exhibition: exhibitionName,
      comments: {content: comment, timestamp: date},
    });
    this.ModelHandler.disconnect();
  }


  /**
   * saves comment into Database
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  saveComment(callback) {
    Comment.connectDB();
    this.commentModelDoc.save(function cb(err) {
      Comment.disconnectDB();
      callback(err);
    });
  }

  /**
   * Removes all Comment from the Database
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static clearAllComment(callback) {
    Comment.connectDB();
    this.CommentModel.collection.remove({}, (err) =>{
      Comment.disconnectDB();
      callback(err);
    });
  }

  /**
   * Removes Comment for specific exhibition
   *
   * @param {String} exhibitionName: name of exhibition to clear comments
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static clearCommentsForExhibition(exhibitionName, callback){
    Comment.connectDB();
    this.CommentModel.findOneAndRemove({ exhibition: exhibitionName }, (err) => {
      Comment.disconnectDB();
      callback(err);
    });
  }

  /**
   * Retrieve list of comments for a specific exhibition
   *
   * @param {String} exhibitionName: name of exhibition to retrieve comments for.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static getCommentForExhibition(exhibitionName, callback) {
    Comment.connectDB();
    this.CommentModel.find({ exhibition: exhibitionName }, (err, commentArr) => {
      Comment.disconnectDB();
      callback(err, commentArr);
    });
  }

  /**
   * Updates the messages made by a specific user of a Comment model instance
   *
   * @param {String} userEmail: User that made the comment.
   * @param {String} exhibitionName: name of exhibition with the comment.
   * @param {String} comment: string content of the comment.
   * @param {Date} date: date object to indicate when the comment is made.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static addCommentForExhibition(userEmail, exhibitionName, comment, date, callback){
    Comment.connectDB();
    const query = {
      user_email: userEmail,
      exhibition: exhibitionName,
    };
    const update = { $push: { comments: { content: comment, timestamp: date }}};
    const options = { new: true };
    this.CommentModel.findOneAndUpdate(query, update, options, (err, results) => {
      Comment.disconnectDB();
      callback(err, results);
    });
  }
} module.exports = Comment;