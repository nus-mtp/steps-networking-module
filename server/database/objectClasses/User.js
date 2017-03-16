const ModelHandler = require('../models/ourModels.js');

const username = '';
const password = '';
const port = '27017';
const host = 'localhost';
const dbName = 'dev';

/**
 * This is the wrapper class used extract out and store information
 * about the Users from the database between view and model
 */


class User {

  /**
   * This method creates a new instance of the model,
   * an error will be thrown if there's a duplicate.
   *
   * @param {String} email: Email used to register in the respective events
   * @param {String} name: name of user
   * @param {String} description: summary of the user
   * @param {String} password: user's password in plain string
   * @param {Boolean} willNotify: Determine if user wants to be notified of new messages by email
   * @param {Boolean} isDeleted: To determine if this user is still valid in the database
   * @param {String} profilePic: A url string which contains the profile picture.
   * @param {StringArray} skills_set: The skills that the user possess.
   * @param {StringArray} bookedmarked_users: A collection of users' emails that
   *                                            the current user wants to keep track of.
   */
  constructor(userEmail = '', userName = '', userDescription = '', userPassword = '', willNotify = true, isDeleted = false, profilePic = '', skillSets = [], bookedmarkedUsers = []) {
    this.ModelHandler = new ModelHandler().initWithParameters(username, password, host, port, dbName);
    this.UserModel = this.ModelHandler.getUserModel();
    this.userModelDoc = new this.UserModel({
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
   * Creates a connection to the database
   */
  static connectDB() {
    this.ModelHandler = new ModelHandler().initWithParameters(username, password, host, port, dbName);
    this.UserModel = this.ModelHandler.getUserModel();
  }

  /**
   * Disconnects from the database
   */
  static disconnectDB() {
    this.ModelHandler.disconnect();
  }


  /**
  * Takes in password from user and checks the hashed version with the database
  *
  * @param {string} password
  * @param {function} callback
  */
  comparePassword(password, callback) {
    User.connectDB();
    this.userModelDoc.comparePassword(password, callback);
    User.disconnectDB();
  }

  /**
   * Saves users into database
   * Report if there's any duplicate
   */
  saveUser(callback) {
    User.connectDB();
    this.userModelDoc.save(function cb(err) {
      callback(err);
    });
    User.disconnectDB();
  }

  /**
   * Remove the collection of Users from database
   */
  static clearAllUser(callback) {
    User.connectDB();
    this.UserModel.remove({}, callback);
    User.disconnectDB();
  }

  /**
   * Returns the entire collection of Users
   * To use this function use
   * User.getAllUsers(function functionName(err,obj) {
   *     if (err){
   *     //error handling
   *     } else {
   *     // do anything to obj. obj is an array of documents.
   *     }
   *  });
   */
  static getAllUsers(callback) {
    User.connectDB();
    this.UserModel.find({}, function cb(err, userDoc) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, userDoc);
      }
    });
    User.disconnectDB();
  }

  /**
   * This method takes in an email and returns a match in the database
   * To use this function use
   * getUser(email, function functionName(err, docs){
   *     if (err){
   *      //error handling
   *    } else {
   *    //do anything to doc here. docs is the UserObject.
   *    //To access attribute, use docs.[attribute];
   *    }
   *  });
   *
   * @param {String} email
   * @param {function} cb
   */
  static getUser(email, callback) {
    User.connectDB();
    this.UserModel.findOne({ email: email }, function cb(err, docs) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, docs);
      }
    });
    User.disconnectDB();
  }

  /**
   * This method updates overwrites all the current attribute content
   * except email with the user input content
   *
   * @param {String} email: used as an identifer for the respective user instance
   * @param {String} name: name of user
   * @param {String} description: a summary of the user
   * @param {String} password: user's password in plain string
   * @param {Boolean} will_notify: To determine if the user wants to be notified
   * @param {Boolean} is_deleted: To determine if this user is still valid in the database
   * @param {String} profile_pic: A url string which contains the profile picture.
   * @param {StringArray} skills_set: The skills that the user possess.
   * @param {StringArray} bookedmarked_users: A collection of emails that user keep track of.
   * @param {callback} for error checking
   */
  static updateUser(email = '', name = '', description = '', password = '', willNotify = true, isDeleted = false, profilePic = '', skillSets = [], bookedmarkedUsers = [], callback) {
    const update = {
      email: email,
      name: name,
      description: description,
      password: password,
      will_notify: willNotify,
      is_deleted: isDeleted,
      profile_picture: profilePic,
      skills: skillSets,
      bookmarked_users: bookedmarkedUsers,
    };
    const options = { new: true };
    User.connectDB();
    this.UserModel.findOneAndUpdate({ email: email }, update, options, function cb(err, docs) {
      if (err) {
        console.log('Error with updating users.');
        callback(err, docs);
      } else if (docs) {
        console.log('User is updated successfully');
        callback(null, docs);
      } else {
        console.log('There is no such users.');
        callback(null, null);
      }
    });
    User.disconnectDB();
  }


  /**
   * This methods filters the list of users base on a single skill
   *
   * @param {string} skillToBeSearched: the skill that is to be matched in the database.
   * @param {function} callback (err, docs): errors are stored in err, results are stored in docs.
   */
  static searchUsersBySkills(skillToBeSearched, callback) {
    User.connectDB();
    this.UserModel.find({ skills: { $regex: new RegExp(skillToBeSearched.replace('+', '\\+'), 'i') } }, function cb(err, docs) {
      if (err) {
        callback(err, null);
      }
      callback(null, docs);
    });
    User.disconnectDB();
  }

  /**
   * This method checks if user is both existing and not marked as deleted in database
   *
   * @param {String} email: to be checked against database
   * @param {function} callback (err,results): errors are stored in err, results is boolean
   */
  static isValidUser(email, callback) {
    User.connectDB();
    this.UserModel.findOne({ email: email }, function cb(err, docs) {
      if (err) {
        callback(err, null);
      } else if (docs) {
        if (!docs.is_deleted) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      } else {
        callback(null, false);
      }
    });
    User.disconnectDB();
  }

  /**
   *This method marks a user as deleted from the database
   *
   * @param {String} email:  the email used to match in the database
   * @param {function} callback (err): any error is returned here
   */
  static setUserAsDeleted(email, boolDeleted, callback) {
    const update = { is_deleted: boolDeleted };
    const options = { new: true };
    User.connectDB();
    this.UserModel.findOneAndUpdate(
      { email: email },
      { $set: update },
      options,
      function cb(err, docs) {
        if (err) {
          callback(err, null);
        } else {
          callback(null, docs);
        }
      });
    User.disconnectDB();
  }
}
module.exports = User;
