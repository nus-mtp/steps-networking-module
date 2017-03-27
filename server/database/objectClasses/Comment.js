const ModelHandler = require('../models/ourModels.js');

/**
 * This is the wrapper class used extract out and store information
 * about the comments from the Database between view and model
 *
 */
class Comment {
  /**
   * Establishes the Comment Model on an existing connection.
   *
   * @param {Mongoose.Connection} db: The connection to the db.
   */
  static setDBConnection(db) {
    if ((!Comment.db || !Comment.CommentModel) || (!Comment.checkConnection())) {
      Comment.db = db;
      Comment.CommentModel = new ModelHandler().initWithConnection(db).getCommentModel();
    }
  }

  /**
   * A function which checks whether the Database connection can be used.
   *
   * @returns {Mongoose.Connection|*|*|Aggregate|Model|boolean}
   */
  static checkConnection() {
    return (Comment.db && Comment.CommentModel &&
      (Comment.db.readyState === 1 || Comment.db.readyState === 2));
  }

  /**
   * Creates a Comment JSON and stores it internally.
   *
   * @param {String} userEmail: The email of the User that made the Comment.
   * @param {mongoose.Schema.ObjectId} exhibitionKey: The ObjectId of the Exhibition.
   * @param {String} comment: The content of the Comment.
   * @param {Date} date: Date object to indicate when the Comment was made.
   */
  constructor(userEmail, exhibitionKey, comment, date) {
    this.commentJSON = {
      user_email: userEmail,
      exhibition_key: exhibitionKey,
      comments: { content: comment, timestamp: date },
    };
  }

  /**
   * Saves the Comment JSON to the Database as an actual Document.
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  saveComment(callback) {
    if (Comment.checkConnection()) {
      const commentDoc = new Comment.CommentModel(this.commentJSON);
      commentDoc.save((err, result) => {
        callback(err, result);
      });
    } else {
      callback(null);
    }
  }

  /**
   * Adds a Comment made by a specific User of a Comment Document.
   *
   * @param {String} userEmail: User that made the Comment.
   * @param {mongoose.Schema.ObjectId} exhibitionKey: The ObjectId of the Exhibition.
   * @param {String} comment: String content of the Comment.
   * @param {Date} date: Date object to indicate when the Comment is made.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static addCommentForExhibition(userEmail, exhibitionKey, comment, date, callback) {
    if (Comment.checkConnection()) {
      const query = {
        user_email: userEmail,
        exhibition_key: exhibitionKey,
      };
      const update = { $push: { comments: { content: comment, timestamp: date } } };
      const options = { new: true };
      Comment.CommentModel.findOneAndUpdate(query, update, options, (err, results) => {
        callback(err, results);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

    /**
   * Retrieve list of Comments for a specific Exhibition.
   *
   * @param {String} userEmail: The unique email used to identify user
   * @param {mongoose.Schema.ObjectId} exhibitionKey: The ObjectID of the Exhibition.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static getUserCommentsForExhibition(userEmail, exhibitionKey, callback) {
    if (Comment.checkConnection()) {
      const query = {
        user_email: userEmail,
        exhibition_key: exhibitionKey,
      };
      Comment.CommentModel.findOne(query, (err, matchedComments) => {
        callback(err, matchedComments);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve list of Comments for a specific Exhibition.
   *
   * @param {mongoose.Schema.ObjectId} exhibitionKey: The ObjectID of the Exhibition.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static getCommentsForExhibition(exhibitionKey, callback) {
    if (Comment.checkConnection()) {
      Comment.CommentModel.find({ exhibition_key: exhibitionKey }, (err, matchedComments) => {
        callback(err, matchedComments);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Removes Comments for a specific Exhibition.
   *
   * @param {mongoose.Schema.ObjectId} exhibitionKey: The ObjectId of the Exhibition.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static clearCommentsForExhibition(exhibitionKey, callback) {
    if (Comment.checkConnection()) {
      Comment.CommentModel.find({ exhibition_key: exhibitionKey }).remove().exec((err, results) => {
        callback(err, results);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Removes all Comments from the Database.
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static clearAllComments(callback) {
    if (Comment.checkConnection()) {
      Comment.CommentModel.collection.remove({}, (err) => {
        callback(err);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

}
module.exports = Comment;
