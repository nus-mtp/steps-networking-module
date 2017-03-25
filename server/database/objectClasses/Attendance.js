const removeDuplicates = require('../../utils/utils').removeDuplicates;
const ModelHandler = require('../models/ourModels.js');

/**
 * This is the wrapper class used extract out and store information
 * about the Attendances from the Database between view and model.
 *
 */

class Attendance {
  /**
   * Establishes the Attendance Model on an existing connection.
   *
   * @param {Mongoose.Connection} db: The connection to the db.
   */
  static setDBConnection(db) {
    if (!Attendance.db || !Attendance.AttendanceModel) {
      Attendance.db = db;
      Attendance.AttendanceModel = new ModelHandler().initWithConnection(db).getAttendanceModel();
    }
  }

  /**
   * A function which checks whether the Database connection can be used.
   *
   * @returns {Mongoose.Connection|*|*|Aggregate|Model|boolean}
   */
  static checkConnection() {
    return (Attendance.db && Attendance.AttendanceModel &&
      (Attendance.db.readyState === 1 || Attendance.db.readyState === 2));
  }

  /**
   * Creates an Attendance JSON and stores it internally.
   *
   * @param {String} userEmail: The name for Users. Does not check if User actually exists or not.
   * @param {mongoose.Schema.ObjectId} attendanceKey: The ObjectId of the Event / Exhibition.
   *    Does not check if the Event / Exhibition exists or not.
   *    Use attendanceType to determine if this is for an Exhibition, or an Event.
   * @param {String} attendanceType: Supposed to be a String enum
   *    containing either 'event' or 'exhibition'.
   *    Used to determine the type of activity attendanceName represents.
   * @param {Array} reason: The User's reasons for attending the Event.
   *    Each reason is a unique String element of the Array.
   */
  constructor(userEmail, attendanceKey, attendanceType, reason) {
    this.attendanceJSON = {
      user_email: userEmail.trim(),
      attendance_key: attendanceKey,
      attendance_type: attendanceType,
      reason: removeDuplicates(reason.map(currReason => currReason.trim().toLowerCase())),
    };
  }

  /**
   * Saves the Attendance JSON to the database as an actual Document.
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  saveAttendance(callback) {
    if (Attendance.checkConnection()) {
      const attendanceDoc = new Attendance.AttendanceModel(this.attendanceJSON);
      attendanceDoc.save((err, result) => {
        callback(err, result);
      });
    } else {
      callback(null);
    }
  }

  /**
   * Retrieve the specific Attendance Document from the Database.
   * Using a User's email, Attendance name and type as the unique identifier.
   *
   * @param {String} userEmail: The name for Users. Does not check if User actually exists or not.
   * @param {mongoose.Schema.ObjectId} attendanceKey: The ObjectID of the Event / Exhibition.
   *    Does not check if the Event / Exhibition exists or not.
   *    Use attendanceType to determine if tthis is for an Exhibition, or an Event.
   *    Used to determine the type of activity attendanceName represents.
   * @param {function} callback: A function that executes once the operation completes.
   */
  static getAttendance(userEmail, attendanceKey, callback) {
    if (Attendance.checkConnection()) {
      const query = {
        user_email: userEmail,
        attendance_key: attendanceKey,
      };
      Attendance.AttendanceModel.findOne(query, (err, attendance) => {
        callback(err, attendance);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve an array of Attendances from the Database.
   *
   * @param {function} callback: A function that is executed once the
   *    operation completes.
   */
  static getAllAttendances(callback) {
    if (Attendance.checkConnection()) {
      Attendance.AttendanceModel.find({}, (err, allAttendances) => {
        callback(err, allAttendances);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve the Attendance Documents that contain the User's email.
   *
   * @param {String} userEmail: Used to match against the user_emails contained in all Attendances.
   * @param {function} callback: A function that executes once the
   *    operation is done.
   */
  static searchAttendancesByUser(userEmail, callback) {
    if (Attendance.checkConnection()) {
      Attendance.AttendanceModel.find({ user_email: userEmail }, (err, matchedAttendances) => {
        callback(err, matchedAttendances);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve the Attendance Documents that contain the specified Event / Exhibition Id
   *
   * @param {mongoose.Schema.ObjectId} attendanceKey: Used to match against the
   *    attendance_key contained in all Attendances.
   * @param {function} callback: A function that executes once the
   *    operation is done.
   */
  static searchAttendancesByKey(attendanceKey, callback) {
    if (Attendance.checkConnection()) {
      Attendance.AttendanceModel.find({ attendance_key: attendanceKey },
          (err, matchedAttendances) => {
            callback(err, matchedAttendances);
          });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve the Attendance Document for a User that contains a specific Event / Exhibition Id
   *
   * @param {String} userEmail: Used to match against the user_emails contained in all Attendances.
   * @param {mongoose.Schema.ObjectId} attendanceKey: Used to match against the
   *    attendance_key contained in all Attendances.
   * @param {function} callback: A function that executes once the
   *    operation is done.
   */
  static searchAttendanceByUserAndKey(userEmail, attendanceKey, callback) {
    if (Attendance.checkConnection()) {
      Attendance.AttendanceModel
            .findOne({ user_email: userEmail.trim(), attendance_key: attendanceKey },
                (err, matchedAttendance) => {
                  callback(err, matchedAttendance);
                });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve the Attendance Documents that contain the specified reasons.
   *
   * @param {String} reason: A String indicating a reason
   *    for Attending an Event / Exhibition to match for.
   * @param {function} callback: A function that executes once the
   *    operation is done.
   */
  static searchAttendancesByReason(reason, callback) {
    if (Attendance.checkConnection()) {
      Attendance.AttendanceModel.find(
            { reason: { $regex: new RegExp(reason.trim().toLowerCase().replace('+', '\\+'), 'i') } },
            (err, matchedAttendances) => {
              callback(err, matchedAttendances);
            },
        );
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve the Attendance Documents that have the Event / Exhibition name and the specified
   * reasons for attending above-mentioned activity.
   *
   * @param {mongoose.Schema.ObjectId} attendanceKey: Used to match against the
   *    attendance_key contained in all Attendances.
   * @param {String} reason: A String indicating a reason
   *    for Attending an Event / Exhibition to match for.
   * @param {function} callback: A function that executes once the
   *    operation is done.
   */
  static searchAttendancesByKeyAndReason(attendanceKey, reason, callback) {
    if (Attendance.checkConnection()) {
      const query = { attendance_key: attendanceKey,
        reason: { $regex: new RegExp(reason.trim().toLowerCase().replace('+', '\\+'), 'i') },
      };
      Attendance.AttendanceModel.find(query, (err, matchedAttendances) => {
        callback(err, matchedAttendances);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Update the Attendance Document stored internally in this object.
   *
   * @param {String} userEmail: The name for Users. Does not check if User actually exists or not.
   * @param {mongoose.Schema.ObjectId} attendanceKey: The ObjectId of the Event / Exhibition.
   *    Does not check if the Event / Exhibition exists or not.
   *    Use attendanceType to determine if this is for an Exhibition, or an Event.
   *    Used to determine the type of activity attendanceName represents.
   * @param {Array} reason: The User's reasons for attending the Event.
   *    Each reason is a unique String element of the Array.
   * @param {function} callback: A function that executes once the
   *    operation is done.
   */
  static updateReason(userEmail, attendanceKey, reason, callback) {
    if (Attendance.checkConnection()) {
      const processedReason = removeDuplicates(reason
          .map(currReason => currReason.trim().toLowerCase()));

      const query = {
        user_email: userEmail,
        attendance_key: attendanceKey,
      };
      const update = { $set: { reason: processedReason } };
      const options = { new: true };
      Attendance.AttendanceModel.findOneAndUpdate(query, update, options,
            (err, results) => {
              callback(err, results);
            });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Deletes a single Attendance Document from the Database.
   *
   * @param {String} userEmail: The name for Users to match for the Attendance Document.
   * @param {mongoose.Schema.ObjectId} attendanceKey: Used to match against the
   *    attendance_key contained in all Attendances.
   * @param {function} callback: A function that executes once the
   *    operation is done.
   */
  static deleteAttendance(userEmail, attendanceKey, callback) {
    if (Attendance.checkConnection()) {
      const query = {
        user_email: userEmail,
        attendance_key: attendanceKey,
      };
      Attendance.AttendanceModel.findOneAndRemove(query, (err) => {
        callback(err);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Remove the collection of Attendances from the Database.
   *
   * @param {function} callback: A function that is executed once the
   *    operation completes.
   */
  static clearAllAttendances(callback) {
    if (Attendance.checkConnection()) {
      Attendance.AttendanceModel.collection.remove({}, (err, results) => {
        callback(err, results);
      });
    } else {
      callback('Not Connected!', null);
    }
  }
}
module.exports = Attendance;
