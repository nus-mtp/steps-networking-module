const ModelHandler = require('../models/ourModels.js');

const config = require('../../config.json');
const currentdb = require('../../currentdb.js');

const username = config[currentdb].username;
const password = config[currentdb].password;
const host = config[currentdb].host;
const port = config[currentdb].port;
const dbName = config[currentdb].database;

/**
 * This is the wrapper class used extract out and store information about the
 * Users from the Database between view and model.
 */

class User {
  /**
   * Creates a connection to the Database
   */
  static connectDB() {
    this.ModelHandler = new ModelHandler()
      .initWithParameters(username, password, host, port, dbName);
    this.userModel = this.ModelHandler.getUserModel();
  }

  /**
   * Disconnects from the Database.
   */
  static disconnectDB() {
    this.ModelHandler.disconnect();
  }

  /**
   * Creates a User Document and stores it internally.
   *
   * @param userEmail: The unique email for this User.
   * @param userName: The name of the User.
   * @param userDescription: The bio for the User.
   * @param userPassword: The password for this User Account.
   * @param willNotify: A boolean value to indicate if the User is to be notified on anything.
   * @param isDeleted: A boolean to indicate if the User is marked as deleted or not.
   * @param profilePic: URL String representing an externally hosted depiction of the User.
   * @param skillSets: A list of Strings representing subject matters the
   *  User has some mastery in.
   * @param bookedmarkedUsers: A list of Strings representing other
   *  userEmails that the User has bookmarked.
   */
  constructor(userEmail = '', userName = '', userDescription = '', userPassword = '',
               willNotify = true, isDeleted = false, profilePic = '', skillSets = [], bookedmarkedUsers = []) {
    this.ModelHandler = new ModelHandler()
      .initWithParameters(username, password, host, port, dbName);
    this.userModel = this.ModelHandler.getUserModel();
    this.userModelDoc = new this.userModel({
      email: userEmail,
      name: userName,
      description: userDescription,
      password: userPassword,
      will_notify: willNotify,
      is_deleted: isDeleted,
      profile_picture: profilePic,
      skills: skillSets,
      bookmarked_users: bookedmarkedUsers,
    });
    this.ModelHandler.disconnect();
  }

  /**
   * Commits the internally stored User Document to the Database.
   *
   * @param callback: A function that executes after the operation is done.
   */
  saveUser(callback) {
    User.connectDB();
    this.userModelDoc.save((err) => {
      User.disconnectDB();
      callback(err);
    });
  }

  /**
   * A function that checks whether a User exists, and if it does, has it been marked as deleted.
   *
   * @param userEmail: The email of the User to check for.
   * @param callback: A function that is executed once the operation completes.
   */
  static isValidUser(userEmail, callback) {
    User.connectDB();
    this.userModel.findOne({ email: userEmail }, (err, user) => {
      User.disconnectDB();
      if (err) {
        callback(err, null);
      } else if (user) {
        if (!user.is_deleted) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      } else {
        callback(null, false);
      }
    });
  }

  /**
  * Takes in password from User and checks the hashed version with the Database.
  *
  * @param testPassword: The password to test for.
  * @param callback: A function that executes once the operation is done.
  */
  comparePassword(testPassword, callback) {
    User.connectDB();
    this.userModelDoc.comparePassword(testPassword, (err, result) => {
      User.disconnectDB();
      callback(err, result);
    });
  }

  /**
   * A function that returns a User from the Database based on the email supplied.
   *
   * @param userEmail: The email of the User to search for.
   * @param callback: A function that is executed when the operation is completed.
   */
  static getUser(userEmail, callback) {
    User.connectDB();
    this.userModel.findOne({ email: userEmail }, (err, user) => {
      User.disconnectDB();
      callback(err, user);
    });
  }

  /**
   *  A function that returns a copy of all Users currently being stored in the Database.
   *
   * @param callback: A function that executes after the operation is done.
   */
  static getAllUsers(callback) {
    User.connectDB();
    this.userModel.find({}, (err, users) => {
      User.disconnectDB();
      callback(err, users);
    });
  }

  /**
   * Finds Users that have a specified skill.
   *
   * @param skillToBeSearched: A skill to search for.
   * @param callback: A function that executes once the operation is done.
   */
  static searchUsersBySkills(skillToBeSearched, callback) {
    User.connectDB();
    this.userModel.find({ skills: { $regex: new RegExp(skillToBeSearched.replace('+', '\\+'), 'i') } }, (err, matchedUsers) => {
      User.disconnectDB();
      callback(err, matchedUsers);
    });
  }

  /**
   * Updates all the information in a specified User - except the email.
   *
   * @param userEmail: The unique email of the User to update.
   * @param userName: The name of the User.
   * @param userDescription: The bio for the User.
   * @param userPassword: The password for this User Account.
   * @param willNotify: A boolean value to indicate if the User is to be notified on anything.
   * @param isDeleted: A boolean to indicate if the User is marked as deleted or not.
   * @param profilePic: URL String representing an externally hosted depiction of the User.
   * @param skillSets: A list of Strings representing subject matters the
   *  User has some mastery in.
   * @param bookedmarkedUsers: A list of Strings representing other
   *  userEmails that the User has bookmarked.
   * @param callback: A function that is executed once the operation is done.
   */
  static updateUser(email = '', name = '', description = '', password = '',
                     willNotify = true, isDeleted = false, profilePic = '', skillSets = [], bookedmarkedUsers = [], callback) {
    const update = {
      email,
      name,
      description,
      password,
      will_notify: willNotify,
      is_deleted: isDeleted,
      profile_picture: profilePic,
      skills: skillSets,
      bookmarked_users: bookedmarkedUsers,
    };
    const options = { new: true };
    User.connectDB();
    this.userModel.findOneAndUpdate({ email }, update, options, (err, results) => {
      User.disconnectDB();
      callback(err, results);
    });
  }

  /**
   * A function that marks a User as deleted.
   *
   * @param userEmail: The email of the User to mark as delete for.
   * @param boolDeleted: The deletion status to set for the User.
   * @param callback: A function that is executed once the operation is done.
   */
  static setUserAsDeleted(userEmail, boolDeleted, callback) {
    const update = { is_deleted: boolDeleted };
    const options = { new: true };
    User.connectDB();
    this.userModel.findOneAndUpdate(
      { email: userEmail },
      { $set: update },
      options,
      (err, results) => {
        User.disconnectDB();
        callback(err, results);
      });
  }

  /**
   * A function that removes all data currently stored within the User Collection of the Database.
   *
   * @param callback: A function that executes once the operation is done.
   */
  static clearAllUser(callback) {
    User.connectDB();
    this.userModel.remove({}, (err) => {
      User.disconnectDB();
      callback(err);
    });
  }
}
module.exports = User;
