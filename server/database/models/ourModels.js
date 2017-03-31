const mongoDBConnector = require('../mongodbScripts/accessMongoDB');

const userSchema = require('../schemas/ourSchemas/user');
const eventSchema = require('../schemas/ourSchemas/event');
const exhibitionSchema = require('../schemas/ourSchemas/exhibition');
const attendanceSchema = require('../schemas/ourSchemas/attendance');
const commentSchema = require('../schemas/ourSchemas/comment');
const messageSchema = require('../schemas/ourSchemas/message');

/**
 * This file defines a Class Object that allows one to get our
 * Mongoose Models from a specified database.
 */
class ModelHandler {

  /**
   * Initializes the ModelHandler with references to Mongoose Models.
   *
   * Assumes the connection has already been established to the backend externally,
   * through the argument passed in. Does not validate the argument in any way.
   *
   * @param {Mongoose.Connection} db: The Mongoose.Connection connection to the database.
   * @returns {ModelHandler}: This instance.
   */
  initWithConnection(db) {
    this.db = db;
    this.UserModel = this
      .db
      .model('user', userSchema);
    this.EventModel = this
      .db
      .model('event', eventSchema);
    this.ExhibitionModel = this
      .db
      .model('exhibition', exhibitionSchema);
    this.AttendanceModel = this
      .db
      .model('attendance', attendanceSchema);
    this.commentModel = this
      .db
      .model('comment', commentSchema);
    this.messageModel = this
      .db
      .model('message', messageSchema);
    return this;
  }

  /**
   * Initializes the ModelHandler with references to Mongoose Models.
   *
   * Starts a connection to the backend implicitly.
   *
   * @param {String} mongoURI: The string representing MongoDB connection information.
   * @returns {ModelHandler}: This instance.
   */
  initWithParameters(mongoURI) {
    this.db = mongoDBConnector.connect(mongoURI);
    this.UserModel = this
      .db
      .model('user', userSchema);
    this.EventModel = this
      .db
      .model('event', eventSchema);
    this.ExhibitionModel = this
      .db
      .model('exhibition', exhibitionSchema);
    this.AttendanceModel = this
      .db
      .model('attendance', attendanceSchema);
    this.commentModel = this
      .db
      .model('comment', commentSchema);
    this.messageModel = this
      .db
      .model('message', messageSchema);
    return this;
  }

  /**
   * Returns a connection established with MongoDB.
   *
   * @returns {Mongoose.Connection|*}
   */
  getConnection() {
    return this.db;
  }

  /**
   * Returns a User Mongoose Model Object - configured for
   * the parameters specified in the constructor.
   *
   * @returns {*|Aggregate|Model}: The Mongoose Model that
   *  can be used to interact with the Users stored in the MongoDB backend.
   */
  getUserModel() {
    return this.UserModel;
  }

  /**
   * Returns an Event Mongoose Model Object - configured for
   * the parameters specified in the constructor.
   *
   * @returns {*|Aggregate|Model}: The Mongoose Model that
   *  can be used to interact with the Events stored in the MongoDB backend.
   */
  getEventModel() {
    return this.EventModel;
  }

  /**
   * Returns an Exhibition Mongoose Model Object - configured for
   * the parameters specified in the constructor.
   *
   * @returns {*|Aggregate|Model}: The Mongoose Model that
   *  can be used to interact with the Exhibitions stored in the MongoDB backend.
   */
  getExhibitionModel() {
    return this.ExhibitionModel;
  }

  /**
   * Returns an Attendance Mongoose Model Object - configured for
   * the parameters specified in the constructor.
   *
   * @returns {*|Aggregate|Model}: The Mongoose Model that
   *  can be used to interact with the Attendances stored in the MongoDB backend.
   */
  getAttendanceModel() {
    return this.AttendanceModel;
  }

  /**
   * Returns an Comment Mongoose Model Object - configured for
   * the parameters specified in the constructor.
   *
   * @returns {*|Aggregate|Model}: The Mongoose Model that
   *  can be used to interact with the Comments stored in the MongoDB backend.
   */
  getCommentModel() {
    return this.commentModel;
  }

  /**
   * Returns an Message Mongoose Model Object - configured for
   * the parameters specified in the constructor.
   *
   * @returns {*|Aggregate|Model}: The Mongoose Model that
   *  can be used to interact with the Messages stored in the MongoDB backend.
   */
  getMessageModel() {
    return this.messageModel;
  }

  /**
   * Closes the implicit backend connection.
   *
   * Needs to be called in order for the Node script to terminate.
   *
   * @param {function} callback: A function that is executed once the disconnect completes.
   */
  disconnect(callback = () => {}) {
    this
      .db
      .close((err) => {
        if (err) {
          console.log(err);
        }

        if (typeof callback === 'function') {
          callback(err);
        }
      });
  }

}

module.exports = ModelHandler;
