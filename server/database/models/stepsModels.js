const mongodbScriptsFilePath = '../mongodbScripts/';
const STePsSchemasFilePath = '../schemas/STePsSchemas/';

const mongoDBConnector = require(`${mongodbScriptsFilePath}accessMongoDB`);

const stepsUserSchema = require(`${STePsSchemasFilePath}stepsUserSchema`);
const stepsGuestSchema = require(`${STePsSchemasFilePath}stepsGuestSchema`);
const stepsModuleSchema = require(`${STePsSchemasFilePath}stepsModuleSchema`);
const stepsEventSchema = require(`${STePsSchemasFilePath}stepsEventSchema`);

/*
  This file defines a Class Object that allows one to get
  the STePs Mongoose Models from a specified database.
*/
class StepsModelHandler {

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
    @param {String} database: The String representing the name of the database to connect to.
  */
  constructor(username, password, host, port, database) {
    this.db = mongoDBConnector.connect(username, password, host, port, database);
    this.userModel = this
      .db
      .model('_User', stepsUserSchema, '_User');
    this.guestModel = this
      .db
      .model('Guest', stepsGuestSchema, 'Guest');
    this.moduleModel = this
      .db
      .model('Module', stepsModuleSchema, 'Module');
    this.eventModel = this
      .db
      .model('Event', stepsEventSchema, 'Event');
  }

  /*
    Returns an User Mongoose Model Object from the STePs DB - configured for
    the parameters specified in the constructor.

    @return {Mongoose.Model} userModel: The Mongoose Model that
      can be used to interact with the MongoDB backend.
  */
  getUserModel() {
    return this.userModel;
  }

  /*
    Returns an GUest Mongoose Model Object from the STePs DB - configured for
    the parameters specified in the constructor.

    @return {Mongoose.Model} guestModel: The Mongoose Model that
      can be used to interact with the MongoDB backend.
  */
  getGuestModel() {
    return this.guestModel;
  }

  /*
    Returns a Module Mongoose Model Object from the STePs DB - configured for
    the parameters specified in the constructor.

    @return {Mongoose.Model} moduleModel: The Mongoose Model that
      can be used to interact with the MongoDB backend.
  */
  getModuleModel() {
    return this.moduleModel;
  }

  /*
    Returns an Event Mongoose Model Object from the STePs DB - configured for
    the parameters specified in the constructor.

    @return {Mongoose.Model} eventModel: The Mongoose Model that
      can be used to interact with the MongoDB backend.
  */
  getEventModel() {
    return this.eventModel;
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

module.exports = StepsModelHandler;
