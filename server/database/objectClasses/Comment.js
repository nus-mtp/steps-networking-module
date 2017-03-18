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
   * @param {function} callback: used for error checking
   */
  saveComment(callback) {
    Comment.connectDB();
    this.commentModelDoc.save(function cb(err) {
      callback(err);
    });
    Comment.disconnectDB();
  }

  static connectDB() {
    this.ModelHandler = new ModelHandler().initWithParameters(username, password, host, port, dbName);
    this.CommentModel = this.ModelHandler.getCommentModel();
  }

  static disconnectDB() {
    this.ModelHandler.disconnect();
  }

  /**
   * Removes all event from the Database
   *
   * @param {function} callback: used for error checking
   */
  static clearAllComment(callback) {
    Comment.connectDB();
    this.CommentModel.collection.remove({}, callback);
    Comment.disconnectDB();
  }

  static clearCommentsForExhibition(exhibitionName, callback){
    Comment.connectDB();
    this.CommentModel.findOneAndRemove({ exhibition: exhibitionName }, callback);
    Comment.disconnectDB();
  }

  static getCommentForExhibition(exhibitionName, callback) {
    Comment.connectDB();
    this.CommentModel.find({ exhibition: exhibitionName }, function cb(err, commentArr){
      if (err){
        callback(err, null);
      } else {
        callback(null, commentArr);
      }
    });
    Comment.disconnectDB();
  }

  static addCommentForExhibition(userEmail, exhibitionName, comment, date, callback){ //does this mean can onli have one unique object with userEmail and exhibition?
    Comment.connectDB();
    const query = {
      user_email: userEmail,
      exhibition_name: exhibitionName,
    };
    const update = {$push: {comments: { content: comment, timestamp: date }}};
    const options = { new: true };
    this.CommentModel.findOne(query, update, options, function cb(err, results) {
      if (err) {
        callback(err, null);
      } else {if (results) {
        callback(null, results);
      } else {
        callback(null, null);
      }}
    });
    Comment.disconnectDB();
  }
} module.exports = Comment;