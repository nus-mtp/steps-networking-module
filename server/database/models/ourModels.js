const mongodbScriptsFilePath = '../mongodbScripts/';
const ourSchemasFilePath = '../schemas/ourSchemas/';

const mongoDBConnector = require(`${mongodbScriptsFilePath}accessMongoDB`);

const userSchema = require(`${ourSchemasFilePath}user`);
const eventSchema = require(`${ourSchemasFilePath}event`);
const exhibitionSchema = require(`${ourSchemasFilePath}exhibition`);
const attendanceSchema = require(`${ourSchemasFilePath}attendance`);
const commentSchema = require(`${ourSchemasFilePath}comment`);
const messageSchema = require(`${ourSchemasFilePath}message`);

/*
  This file defines a Class Object that allows one to get our
  Mongoose Models from a specified database.
*/
class ModelHandler {

  /*
    Initializes the ModelHandler with references to Mongoose Models.

    Starts a connection to the backend implicitly.

    @param {String} username: The String containing a part of the login
                              credentials required to access the DB.
    @param {String} password: The String containing a part of the login
                              credentials required to access the DB.
    @param {String} host: The String containing the name of the host
                          that the MongoDB Server is running on.
    @param {String} port: The String containing the port number of the
                          MongoDB Server process on host.
    @param {String} name: The String representing the name of the database to connect to.
  */
  constructor(username, password, host, port, name) {
    this.db = mongoDBConnector.connect(username, password, host, port, name);
    this.userModel = this
      .db
      .model('user', userSchema);
    this.eventModel = this
      .db
      .model('event', eventSchema);
    this.exhibitionModel = this
      .db
      .model('exhibition', exhibitionSchema);
    this.attendanceModel = this
      .db
      .model('attendance', attendanceSchema);
    this.commentModel = this
      .db
      .model('comment', commentSchema);
    this.messageModel = this
      .db
      .model('message', messageSchema);
  }

  /*
    Returns a User Mongoose Model Object - configured for
    the parameters specified in the constructor.

    @return {Mongoose.Model} userModel: The Mongoose Model that
      can be used to interact with the Users stored in the MongoDB backend.
  */
  getUserModel() {
    return this.userModel;
  }

  /*
    Returns a Event Mongoose Model Object - configured for
    the parameters specified in the constructor.

    @return {Mongoose.Model} eventModel: The Mongoose Model that
      can be used to interact with the Events stored in the MongoDB backend.
  */
  getEventModel() {
    return this.eventModel;
  }

  /*
    Returns a Exhibition Mongoose Model Object - configured for
    the parameters specified in the constructor.

    @return {Mongoose.Model} exhibitionModel: The Mongoose Model that
      can be used to interact with the Exhibitions stored in the MongoDB backend.
  */
  getExhibitionModel() {
    return this.exhibitionModel;
  }

  /*
    Returns a Attendance Mongoose Model Object - configured for
    the parameters specified in the constructor.

    @return {Mongoose.Model} attendanceModel: The Mongoose Model that can
      be used to interact with the Attendances stored in the MongoDB backend.
  */
  getAttendanceModel() {
    return this.attendanceModel;
  }

  /*
    Returns a Comment Mongoose Model Object - configured for
    the parameters specified in the constructor.

    @return {Mongoose.Model} commentModel: The Mongoose Model that can
      be used to interact with the Comments stored in the MongoDB backend.
  */
  getCommentModel() {
    return this.commentModel;
  }

  /*
    Returns a Message Mongoose Model Object - configured for
    the parameters specified in the constructor.

    @return {Mongoose.Model} messageModel: The Mongoose Model that can
      be used to interact with the Messages stored in the MongoDB backend.
  */
  getMessageModel() {
    return this.messageModel;
  }

  /*
    Closes the implicit backend connection.
    Needs to be called in order for the Node script to terminate.

    @param {function} callback: An optional function that can
      be sent in to execute after the db closes.
  */
  disconnect(callback) {
    this
      .db
      .close((err) => {
        if (err) {
          console.log(err);
        }

        if (typeof callback === 'function') {
          callback();
        }
      });
  }

}

module.exports = ModelHandler;
