const removeDuplicates = require('../../utils/utils').removeDuplicates;
const ModelHandler = require('../models/ourModels.js');

/**
 * This is the wrapper class used extract out and store information about the
 * Users from the Database between view and model.
 */

class User {
  /**
   * Establishes the User Model on an existing connection.
   *
   * @param {Mongoose.Connection} db: The connection to the db.
   */
  static setDBConnection(db) {
    if (!User.db || !User.UserModel) {
      User.db = db;
      User.UserModel = new ModelHandler().initWithConnection(db).getUserModel();
    }
  }

  /**
   * A function which checks whether the Database connection can be used.
   *
   * @returns {Mongoose.Connection|*|*|Aggregate|Model|boolean}
   */
  static checkConnection() {
    return (User.db && User.UserModel &&
      (User.db.readyState === 1 || User.db.readyState === 2));
  }

  /**
   * Creates a User JSON and stores it internally.
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
    this.userJSON = {
      email: userEmail.trim(),
      name: userName.trim(),
      description: userDescription,
      password: userPassword,
      will_notify: willNotify,
      is_deleted: isDeleted,
      profile_picture: profilePic,
      skills: removeDuplicates(skillSets.map(skill => skill.trim().toLowerCase())),
      bookmarked_users: removeDuplicates(bookmarkedUsers),
    };
  }

  /**
   * Saves the User JSON to the Database as an actual document.
   *
   * @param {function} callback: A function that executes after the operation is done.
   */
  saveUser(callback) {
    if (User.checkConnection()) {
      const userDoc = new User.UserModel(this.userJSON);
      userDoc.save((err, result) => {
        callback(err, result);
      });
    } else {
      callback(null);
    }
  }

  /**
   * A function that checks whether a User exists, and if it does, has it been marked as deleted.
   *
   * @param {String} userEmail: The email of the User to check for.
   * @param {function} callback: A function that is executed once the operation completes.
   */
  static isValidUser(userEmail, callback) {
    if (User.checkConnection()) {
      User.UserModel.findOne({ email: userEmail }, (err, user) => {
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
    } else {
      callback('Not Connected!', undefined);
    }
  }

  /**
   * A function that returns a User from the Database based on the email supplied.
   *
   * @param {String} userEmail: The email of the User to search for.
   * @param {function} callback: A function that is executed when the operation is completed.
   */
  static getUser(userEmail, callback) {
    if (User.checkConnection()) {
      User.UserModel.findOne({ email: userEmail }, (err, user) => {
        callback(err, user);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * A function that returns a populated variant of the bookmarked_users
   * array stored in the specified User's document.
   *
   * @param {String} userEmail: The email of the User to get the bookmarked_users from.
   * @param {function} callback: A function that executes once the operation finishes.
   */
  static getBookmarksForUser(userEmail, callback) {
    if (User.checkConnection()) {
      User.UserModel
            .findOne({ email: userEmail })
            .populate('bookmarked_users', 'email name profile_picture will_notify is_deleted')
            .exec((err, user) => {
              if (user) {
                callback(err, user.bookmarked_users);
              } else {
                callback(err, user);
              }
            });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve a specific User in the Database, using its Id.
   *
   * @param {mongoose.Schema.ObjectId} userId:
   *    The id of a User to search for.
   * @param {function} callback: A function that executes once the operation is done.
   */
  static getUserById(userId, callback) {
    if (User.checkConnection()) {
      User.UserModel.findById(userId, (err, user) => {
        callback(err, user);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   *  A function that returns a copy of all Users currently being stored in the Database.
   *
   * @param {function} callback: A function that executes after the operation is done.
   */
  static getAllUsers(callback) {
    if (User.checkConnection()) {
      User.UserModel.find({}, (err, users) => {
        callback(err, users);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Finds Users that have a specified skill.
   *
   * @param {String} skillToBeSearched: A skill to search for.
   * @param {function} callback: A function that executes once the operation is done.
   */
  static searchUsersBySkills(skillToBeSearched, callback) {
    if (User.checkConnection()) {
      User.UserModel.find({ skills: { $regex: new RegExp(skillToBeSearched.trim().toLowerCase().replace('+', '\\+'), 'i') } }, (err, matchedUsers) => {
        callback(err, matchedUsers);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Updates the description of a specified User.
   *
   * @param {String} userEmail: The email of the User to update.
   * @param {String} description: The new description to replace the User's description with.
   * @param {function} callback: A function that executes once the operation is done.
   */
  static updateUserDescription(userEmail, description, callback) {
    if (User.checkConnection()) {
      User.UserModel.findOne({ email: userEmail }, (err, user) => {
        if (user) {
          user.set('description', description);
          user.save((err, updatedUser) => {
            callback(err, updatedUser);
          });
        } else {
          callback(err, user);
        }
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Updates the willNotify setting of a specified User.
   *
   * @param {String} userEmail: The email of the User to update.
   * @param {Boolean} willNotify: The new notification settings for this User.
   * @param {function} callback: A function that executes once the operation is done.
   */
  static updateUserNotification(userEmail, willNotify, callback) {
    if (User.checkConnection()) {
      User.UserModel.findOne({ email: userEmail }, (err, user) => {
        if (user) {
          user.set('will_notify', willNotify);
          user.save((err, updatedUser) => {
            callback(err, updatedUser);
          });
        } else {
          callback(err, user);
        }
      });
    } else {
      callback('Not Connected!', null);
    }
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
    if (User.checkConnection()) {
      User.UserModel.findOne({ email: userEmail }, (err, user) => {
        if (user) {
          user.set('profile_picture', profilePicURL);
          user.save((err, updatedUser) => {
            callback(err, updatedUser);
          });
        } else {
          callback(err, user);
        }
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Adds a skill for the User.
   *
   * @param {String} userEmail: The email of the User to add the skill for.
   * @param {String} skill: The skill to add into the User's skill array.
   * @param {function} callback: A function that executes once the operation is done.
   */
  static addSkillToUserSkills(userEmail, skill, callback) {
    if (User.checkConnection()) {
      User.UserModel.findOne({ email: userEmail }, (err, user) => {
        if (user) {
          user.set('skills', removeDuplicates(user.get('skills').concat(skill.trim().toLowerCase())));
          user.save((err, updatedUser) => {
            callback(err, updatedUser);
          });
        } else {
          callback(err, user);
        }
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Removes a skill for the User.
   *
   * @param {String} userEmail: The email of the User to remove the skill for.
   * @param {String} skill: The skill to remove from the User's skill array.
   * @param {function} callback: A function that executes once the operation is done.
   */
  static removeSkillFromUser(userEmail, skill, callback) {
    if (User.checkConnection()) {
      User.UserModel.findOne({ email: userEmail }, (err, user) => {
        if (user) {
          user.set('skills', user.get('skills').filter(currSkill => (currSkill !== skill.trim().toLowerCase())));
          user.save((err, updatedUser) => {
            callback(err, updatedUser);
          });
        } else {
          callback(err, user);
        }
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Sets the array of skills for the User.
   *
   * @param {String} userEmail: The email of the User to set the skills for.
   * @param {Array} skills:
   *    The array of String objects representing the skills that the User is proficient in.
   * @param {function} callback: A function that executes once the operation is done.
   */
  static setSkillsForUser(userEmail, skills, callback) {
    if (User.checkConnection()) {
      User.UserModel.findOne({ email: userEmail }, (err, user) => {
        if (user) {
          user.set('skills', removeDuplicates(skills.map(skill => skill.trim().toLowerCase())));
          user.save((err, updatedUser) => {
            callback(err, updatedUser);
          });
        } else {
          callback(err, user);
        }
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Saves a User's Id into the specified User's bookmarks.
   *
   * @param {String} userEmail: The email of the User to add the bookmark for.
   * @param {mongoose.Schema.ObjectId} bookmarkedUserId: The Id of the bookmarked User.
   *    Does not perform validation on supplied ObjectId.
   * @param {function} callback: A function that executes once the operation completes.
   */
  static addBookmarkedUserForUser(userEmail, bookmarkedUserId, callback) {
    if (User.checkConnection()) {
      User.UserModel.findOne({ email: userEmail }, (err, user) => {
        if (user) {
          user.set('bookmarked_users', removeDuplicates(user.get('bookmarked_users').map(bUserId => bUserId.toString()).concat(bookmarkedUserId.toString())));
          user.save((err, updatedUser) => {
            callback(err, updatedUser);
          });
        } else {
          callback(err, user);
        }
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Removes a saved User Id from a specified User's bookmarks.
   *
   * @param {String} userEmail: The email of the User to remove the bookmark from.
   * @param {mongoose.Schema.ObjectId} bookmarkedUserId: The Id of the bookmarked User.
   * @param {function} callback: A function that executes once the operation completes.
   */
  static removeBookmarkedUserFromUser(userEmail, bookmarkedUserId, callback) {
    if (User.checkConnection()) {
      User.UserModel.findOne({ email: userEmail }, (err, user) => {
        if (user) {
          user.set('bookmarked_users', user.get('bookmarked_users').filter(currBookmarkedUserId => (currBookmarkedUserId.toString() !== bookmarkedUserId.toString())));
          user.save((err, updatedUser) => {
            callback(err, updatedUser);
          });
        } else {
          callback(err, user);
        }
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Sets the array of bookmarked Users for the specified User.
   *
   * @param {String} userEmail: The email of the User to set the bookmarks for.
   * @param {Array} bookmarkedUserIds: The array of User Ids to set the bookmarks for.
   * @param {function} callback: A function that executes once the operation is done.
   */
  static setBookmarksForUser(userEmail, bookmarkedUserIds, callback) {
    if (User.checkConnection()) {
      User.UserModel.findOne({ email: userEmail }, (err, user) => {
        if (user) {
          user.set('bookmarked_users', removeDuplicates(bookmarkedUserIds));
          user.save((err, updatedUser) => {
            callback(err, updatedUser);
          });
        } else {
          callback(err, user);
        }
      });
    } else {
      callback('Not Connected!', null);
    }
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
   * @param {Array} bookmarkedUserIds: A list of ObjectIds referencing other Users the User has bookmarked.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static updateUser(email = '', name = '', description = '', password = '',
    willNotify = true, isDeleted = false, profilePic = '', skillSets = [], bookmarkedUserIds = [], callback) {
    const update = {
      email: email.trim(),
      name: name.trim(),
      description,
      password,
      will_notify: willNotify,
      is_deleted: isDeleted,
      profile_picture: profilePic,
      skills: removeDuplicates(skillSets.map(skill => skill.trim().toLowerCase())),
      bookmarked_users: removeDuplicates(bookmarkedUserIds),
    };
    const options = { new: true };
    if (User.checkConnection()) {
      User.UserModel.findOneAndUpdate({ email }, update, options, (err, results) => {
        callback(err, results);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * A function that marks a User as deleted.
   *
   * @param {String} userEmail: The email of the User to mark as delete for.
   * @param {Boolean} isDeleted: The deletion status to set for the User.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static setUserAsDeleted(userEmail, isDeleted, callback) {
    if (User.checkConnection()) {
      const update = { is_deleted: isDeleted };
      const options = { new: true };
      User.UserModel.findOneAndUpdate(
            { email: userEmail },
            { $set: update },
            options,
            (err, results) => {
              callback(err, results);
            });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * A function that removes all data currently stored within the User Collection of the Database.
   *
   * @param {function} callback: A function that executes once the operation is done.
   */
  static clearAllUsers(callback) {
    if (User.checkConnection()) {
      User.UserModel.remove({}, (err) => {
        callback(err);
      });
    } else {
      callback('Not Connected!', null);
    }
  }
}
module.exports = User;
