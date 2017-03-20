const removeDuplicates = require('../../utils/utils').removeDuplicates;
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
   * Creates a connection to the Database.
   */
  static connectDB() {
    this.ModelHandler = new ModelHandler()
      .initWithParameters(username, password, host, port, dbName);
    this.UserModel = this.ModelHandler.getUserModel();
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
   * @param {String} userEmail: The unique email for this User.
   * @param {String} userName: The name of the User.
   * @param {String} userDescription: The bio for the User.
   * @param {String} userPassword: The password for this User Account.
   * @param {Boolean} willNotify:
   *    A boolean value to indicate if the User is to be notified on anything.
   * @param {Boolean} isDeleted: A boolean to indicate if the User is marked as deleted or not.
   * @param {String} profilePic: URL String representing an externally hosted depiction of the User.
   * @param {Array} skillSets: A list of Strings representing subject matters the
   *    User has some mastery in.
   * @param {Array} bookmarkedUsers: A list of Strings representing other
   *    userEmails that the User has bookmarked.
   */
  constructor(userEmail = '', userName = '', userDescription = '', userPassword = '',
    willNotify = true, isDeleted = false, profilePic = '', skillSets = [], bookmarkedUsers = []) {
    this.ModelHandler = new ModelHandler()
      .initWithParameters(username, password, host, port, dbName);
    this.UserModel = this.ModelHandler.getUserModel();
    this.userModelDoc = new this.UserModel({
      email: userEmail.trim(),
      name: userName.trim(),
      description: userDescription,
      password: userPassword,
      will_notify: willNotify,
      is_deleted: isDeleted,
      profile_picture: profilePic,
      skills: skillSets.map(skill => skill.trim().toLowerCase()),
      bookmarked_users: bookmarkedUsers.map(bookmarkedUser => bookmarkedUser.trim()),
    });
    this.ModelHandler.disconnect();
  }

  /**
   * Saves the User Document stored internally to the Database.
   *
   * @param {function} callback: A function that executes after the operation is done.
   */
  saveUser(callback) {
    User.connectDB();
    this.userModelDoc.save((err) => {
      User.disconnectDB();
      callback(err);
    });
  }

  /**
   * Takes in password from User and checks the hashed version with the Database.
   *
   * @param {String} testPassword: The password to test for.
   * @param {function} callback: A function that executes once the operation is done.
   */
  comparePassword(testPassword, callback) {
    User.connectDB();
    this.userModelDoc.comparePassword(testPassword, (err, result) => {
      User.disconnectDB();
      callback(err, result);
    });
  }

  /**
   * A function that checks whether a User exists, and if it does, has it been marked as deleted.
   *
   * @param {String} userEmail: The email of the User to check for.
   * @param {function} callback: A function that is executed once the operation completes.
   */
  static isValidUser(userEmail, callback) {
    User.connectDB();
    this.UserModel.findOne({ email: userEmail }, (err, user) => {
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
   * A function that returns a User from the Database based on the email supplied.
   *
   * @param {String} userEmail: The email of the User to search for.
   * @param {function} callback: A function that is executed when the operation is completed.
   */
  static getUser(userEmail, callback) {
    User.connectDB();
    this.UserModel.findOne({ email: userEmail }, (err, user) => {
      User.disconnectDB();
      callback(err, user);
    });
  }

  /**
   *  A function that returns a copy of all Users currently being stored in the Database.
   *
   * @param {function} callback: A function that executes after the operation is done.
   */
  static getAllUsers(callback) {
    User.connectDB();
    this.UserModel.find({}, (err, users) => {
      User.disconnectDB();
      callback(err, users);
    });
  }

  /**
   * Finds Users that have a specified skill.
   *
   * @param {String} skillToBeSearched: A skill to search for.
   * @param {function} callback: A function that executes once the operation is done.
   */
  static searchUsersBySkills(skillToBeSearched, callback) {
    User.connectDB();
    this.UserModel.find({ skills: { $regex: new RegExp(skillToBeSearched.replace('+', '\\+'), 'i') } }, (err, matchedUsers) => {
      User.disconnectDB();
      callback(err, matchedUsers);
    });
  }

  /**
   * Updates the description of a specified User.
   *
   * @param {String} userEmail: The email of the User to update.
   * @param {String} description: The new description to replace the User's description with.
   * @param {function} callback: A function that executes once the operation is done.
   */
  static updateUserDescription(userEmail, description, callback) {
    User.connectDB();
    this.UserModel.findOne({ email: userEmail }, (err, user) => {
      if (user) {
        user.set('description', description);
        user.save((err, updatedUser) => {
          User.disconnectDB();
          callback(err, updatedUser);
        });
      } else {
        User.disconnectDB();
        callback(err, user);
      }
    });
  }

  /**
   * Updates the willNotify setting of a specified User.
   *
   * @param {String} userEmail: The email of the User to update.
   * @param {Boolean} willNotify: The new notification settings for this User.
   * @param {function} callback: A function that executes once the operation is done.
   */
  static updateUserNotification(userEmail, willNotify, callback) {
    User.connectDB();
    this.UserModel.findOne({ email: userEmail }, (err, user) => {
      if (user) {
        user.set('will_notify', willNotify);
        user.save((err, updatedUser) => {
          User.disconnectDB();
          callback(err, updatedUser);
        });
      } else {
        User.disconnectDB();
        callback(err, user);
      }
    });
  }

  /**
   * Updates the willNotify setting of a specified User.
   *
   * @param {String} userEmail: The email of the User to update.
   * @param {String} profilePicURL:
   *    A URL representing an externally hosted visual representation of the User.
   * @param {function} callback: A function that executes once the operation is done.
   */
  static updateUserProfilePicture(userEmail, profilePicURL, callback) {
    User.connectDB();
    this.UserModel.findOne({ email: userEmail }, (err, user) => {
      if (user) {
        user.set('profile_picture', profilePicURL);
        user.save((err, updatedUser) => {
          User.disconnectDB();
          callback(err, updatedUser);
        });
      } else {
        User.disconnectDB();
        callback(err, user);
      }
    });
  }

  /**
   * Adds a skill for the User.
   *
   * @param {String} userEmail: The email of the User to add the skill for.
   * @param {String} skill: The skill to add into the User's skill array.
   * @param {function} callback: A function that executes once the operation is done.
   */
  static addSkillToUserSkills(userEmail, skill, callback) {
    User.connectDB();
    this.UserModel.findOne({ email: userEmail }, (err, user) => {
      if (user) {
        user.set('skills', removeDuplicates(user.get('skills').concat(skill.trim().toLowerCase())));
        user.save((err, updatedUser) => {
          User.disconnectDB();
          callback(err, updatedUser);
        });
      } else {
        User.disconnectDB();
        callback(err, user);
      }
    });
  }

  /**
   * Removes a skill for the User.
   *
   * @param {String} userEmail: The email of the User to remove the skill for.
   * @param {String} skill: The skill to remove from the User's skill array.
   * @param {function} callback: A function that executes once the operation is done.
   */
  static removeSkillFromUser(userEmail, skill, callback) {
    User.connectDB();
    this.UserModel.findOne({ email: userEmail }, (err, user) => {
      if (user) {
        user.set('skills', user.get('skills').filter(currSkill => (currSkill !== skill.trim().toLowerCase())));
        user.save((err, updatedUser) => {
          User.disconnectDB();
          callback(err, updatedUser);
        });
      } else {
        User.disconnectDB();
        callback(err, user);
      }
    });
  }

  /**
   * Saves a User's email into the specified User's bookmarks.
   *
   * @param {String} userEmail: The email of the User to add the bookmark for.
   * @param {String} bookmarkedUserEmail: The email of the bookmarked User.
   *    Does not perform validation on supplied email.
   * @param {function} callback: A function that executes once the operation completes.
   */
  static addBookmarkedUserForUser(userEmail, bookmarkedUserEmail, callback) {
    User.connectDB();
    this.UserModel.findOne({ email: userEmail }, (err, user) => {
      if (user) {
        user.set('bookmarked_users', removeDuplicates(user.get('bookmarked_users').concat(bookmarkedUserEmail.trim())));
        user.save((err, updatedUser) => {
          User.disconnectDB();
          callback(err, updatedUser);
        });
      } else {
        User.disconnectDB();
        callback(err, user);
      }
    });
  }

  /**
   * Removes a saved User email from a specified User's bookmarks.
   *
   * @param {String} userEmail: The email of the User to remove the bookmark from.
   * @param {String} bookmarkedUserEmail: The email of the bookmarked User.
   * @param {function} callback: A function that executes once the operation completes.
   */
  static removeBookmarkedUserFromUser(userEmail, bookmarkedUserEmail, callback) {
    User.connectDB();
    this.UserModel.findOne({ email: userEmail }, (err, user) => {
      if (user) {
        user.set('bookmarked_users', user.get('bookmarked_users').filter(currBookmarkedUserEmail => (currBookmarkedUserEmail !== bookmarkedUserEmail.trim())));
        user.save((err, updatedUser) => {
          User.disconnectDB();
          callback(err, updatedUser);
        });
      } else {
        User.disconnectDB();
        callback(err, user);
      }
    });
  }

  /**
   * Updates all the information in a specified User - except the email.
   *
   * @param {String} email: The unique email for this User.
   * @param {String} name: The name of the User.
   * @param {String} description: The bio for the User.
   * @param {String} password: The password for this User Account.
   * @param {Boolean} willNotify:
   *    A boolean value to indicate if the User is to be notified on anything.
   * @param {Boolean} isDeleted: A boolean to indicate if the User is marked as deleted or not.
   * @param {String} profilePic: URL String representing an externally hosted depiction of the User.
   * @param {Array} skillSets: A list of Strings representing subject matters the
   *    User has some mastery in.
   * @param {Array} bookedmarkedUsers: A list of Strings representing other
   *    userEmails that the User has bookmarked.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static updateUser(email = '', name = '', description = '', password = '',
    willNotify = true, isDeleted = false, profilePic = '', skillSets = [], bookmarkedUsers = [], callback) {
    const update = {
      email: email.trim(),
      name: name.trim(),
      description,
      password,
      will_notify: willNotify,
      is_deleted: isDeleted,
      profile_picture: profilePic,
      skills: skillSets.map(skill => skill.trim().toLowerCase()),
      bookmarked_users: bookmarkedUsers.map(bookmarkedUser => bookmarkedUser.trim()),
    };
    const options = { new: true };
    User.connectDB();
    this.UserModel.findOneAndUpdate({ email }, update, options, (err, results) => {
      User.disconnectDB();
      callback(err, results);
    });
  }

  /**
   * A function that marks a User as deleted.
   *
   * @param {String} userEmail: The email of the User to mark as delete for.
   * @param {Boolean} isDeleted: The deletion status to set for the User.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static setUserAsDeleted(userEmail, isDeleted, callback) {
    const update = { is_deleted: isDeleted };
    const options = { new: true };
    User.connectDB();
    this.UserModel.findOneAndUpdate(
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
   * @param {function} callback: A function that executes once the operation is done.
   */
  static clearAllUsers(callback) {
    User.connectDB();
    this.UserModel.remove({}, (err) => {
      User.disconnectDB();
      callback(err);
    });
  }
}
module.exports = User;
