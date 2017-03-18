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
 * about the Attendances from the Database between view and model.
 *
 */

class Attendance {
  /**
   * Creates a connection to the Database.
   */
  static connectDB() {
    this.ModelHandler = new ModelHandler()
          .initWithParameters(username, password, host, port, dbName);
    this.AttendanceModel = this.ModelHandler.getAttendanceModel();
  }

  /**
   * Disconnects from the Database.
   */
  static disconnectDB() {
    this.ModelHandler.disconnect();
  }

  /**
   * Creates an Attendance Document and stores it internally.
   *
   * @param {String} userEmail: The name for Users. Does not check if User actually exists or not.
   * @param {String} attendanceName: The name of the Event / Exhibition.
   *    Does not check if the Event / Exhibition exists or not.
   *    Use attendanceType to determine if the name is for an Exhibition, or an Event.
   * @param {String} attendanceType: Supposed to be a String enum
   *    containing either 'event' or 'exhibition'.
   *    Used to determine the type of activity attendanceName represents.
   * @param {Array} reason: The User's reasons for attending the Event.
   *    Each reason is a unique String element of the Array.
   */
  constructor(userEmail, attendanceName, attendanceType, reason) {
    this.ModelHandler = new ModelHandler()
        .initWithParameters(username, password, host, port, dbName);
    this.AttendanceModel = this.ModelHandler.getAttendanceModel();
    this.attendanceModelDoc = new this.AttendanceModel({
      user_email: userEmail,
      attendance_name: attendanceName,
      attendance_type: attendanceType,
      reason,
    });
    this.ModelHandler.disconnect();
  }

  /**
   * Saves the Attendance Document stored internally to the Database.
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  saveAttendance(callback) {
    Attendance.connectDB();
    this.attendanceModelDoc.save((err) => {
      Attendance.disconnectDB();
      callback(err);
    });
  }

  /**
   * Retrieve the specific Attendance Document from the Database.
   * Using a User's email, Attendance name and type as the unique identifer.
   *
   * @param {String} userEmail: The name for Users. Does not check if User actually exists or not.
   * @param {String} attendanceName: The name of the Event / Exhibition.
   *    Does not check if the Event / Exhibition exists or not.
   *    Use attendanceType to determine if the name is for an Exhibition, or an Event.
   * @param {String} attendanceType: Supposed to be a String enum
   *    containing either 'event' or 'exhibition'.
   *    Used to determine the type of activity attendanceName represents.
   * @param {function} callback: A function that executes once the operation completes.
   */
  static getAttendance(userEmail, attendanceName, attendanceType, callback) {
    Attendance.connectDB();
    const query = { user_email: userEmail,
      attendance_name: attendanceName,
      attendance_type: attendanceType,
    };
    this.AttendanceModel.findOne(query, (err, attendance) => {
      Attendance.disconnectDB();
      callback(err, attendance);
    });
  }

  /**
   * Retrieve an array of Attendances from the Database.
   *
   * @param {function} callback: A function that is executed once the
   *    operation completes.
   */
  static getAllAttendances(callback) {
    Attendance.connectDB();
    this.AttendanceModel.find({}, (err, allAttendances) => {
      Attendance.disconnectDB();
      callback(err, allAttendances);
    });
  }

  /**
   * Retrieve the Attendance Documents that contain a User's email.
   *
   * @param {String} userEmail: Used to match against the user_emails contained in all Attendances.
   * @param {function} callback: A function that executes once the
   *    operation is done.
   */
  static searchAttendancesByUser(userEmail, callback) {
    Attendance.connectDB();
    this.AttendanceModel.find({ user_email: userEmail }, (err, matchedAttendances) => {
      Attendance.disconnectDB();
      callback(err, matchedAttendances);
    });
  }

  /**
   * Retrieve the Attendance Documents that contain the specified Event / Exhibition name.
   *
   * @param {String} attendanceName: Used to match against the
   *    attendance_name contained in all Attendances.
   * @param {function} callback: A function that executes once the
   *    operation is done.
   */
  static searchAttendancesByName(attendanceName, callback) {
    Attendance.connectDB();
    this.AttendanceModel.find({ attendance_name: attendanceName }, (err, matchedAttendances) => {
      Attendance.disconnectDB();
      callback(err, matchedAttendances);
    });
  }

  /**
   * Retrieve the Attendance Documents that contain the specified Event / Exhibition name.
   *
   * @param {String} attendanceName: Used to match against the
   *    attendance_name contained in all Attendances.
   * @param {String} attendanceType: A String enum that is supposed
   *    to be either 'event' or 'exhibition'.
   * @param {function} callback: A function that executes once the
   *    operation is done.
   */
  static searchAttendancesByNameAndType(attendanceName, attendanceType, callback) {
    Attendance.connectDB();
    const query = {
      attendance_name: attendanceName,
      attendance_type: attendanceType,
    };
    this.AttendanceModel.find(query, (err, matchedAttendances) => {
      Attendance.disconnectDB();
      callback(err, matchedAttendances);
    });
  }

  /**
   * Retrieve the Attendance Documents that contain the specified reasons.
   *
   * @param {Array} reasons: An array of Strings indicating reasons
   *    for Attending an Event / Exhibition to match for.
   * @param {function} callback: A function that executes once the
   *    operation is done.
   */
  static searchAttendancesByReason(reasons, callback) {
    Attendance.connectDB();
    this.AttendanceModel.find(
      { reason: { $regex: new RegExp(reasons.replace('+', '\\+'), 'i') } },
      (err, matchedAttendances) => {
        Attendance.disconnectDB();
        callback(err, matchedAttendances);
      },
    );
  }

  /**
   * Retrieve the Attendance Documents that have the Event / Exhibition name and the specified
   * reasons for attending above-mentioned activity.
   *
   * @param {String} attendanceName: Used to match against the
   *    attendance_name contained in all Attendances.
   * @param {Array} reasons: An array of Strings indicating reasons
   *    for Attending an Event / Exhibition to match for.
   * @param {function} callback: A function that executes once the
   *    operation is done.
   */
  static searchAttendanceByNameAndReason(attendanceName, reasons, callback) {
    Attendance.connectDB();
    const query = { attendance_name: attendanceName,
      reason: { $regex: new RegExp(reasons.replace('+', '\\+'), 'i') },
    };
    this.AttendanceModel.find(query, (err, matchedAttendances) => {
      Attendance.disconnectDB();
      callback(err, matchedAttendances);
    });
  }

  /**
   * Update the Attendance Document stored internally in this object.
   *
   * @param {String} userEmail: The name for Users. Does not check if User actually exists or not.
   * @param {String} attendanceName: The name of the Event / Exhibition.
   *    Does not check if the Event / Exhibition exists or not.
   *    Use attendanceType to determine if the name is for an Exhibition, or an Event.
   * @param {String} attendanceType: Supposed to be a String enum
   *    containing either 'event' or 'exhibition'.
   *    Used to determine the type of activity attendanceName represents.
   * @param {Array} reason: The User's reasons for attending the Event.
   *    Each reason is a unique String element of the Array.
   * @param {function} callback: A function that executes once the
   *    operation is done.
   */
  static updateReason(userEmail, attendanceName, attendanceType, reason, callback) {
    Attendance.connectDB();
    const query = { user_email: userEmail,
      attendance_name: attendanceName,
      attendance_type: attendanceType,
    };
    const update = { $set: { reason } };
    const options = { new: true };
    this.AttendanceModel.findOneAndUpdate(query, update, options,
                                         (err, results) => {
                                           Attendance.disconnectDB();
                                           callback(err, results);
                                         });
  }

  /**
   * Deletes a single Attendance Document from the Database.
   *
   * @param {String} userEmail: The name for Users to match for the Attendance Document.
   * @param {String} attendanceName: The name of the Event / Exhibition
   *    to match for the Attendance Document.
   * @param {String} attendanceType: Supposed to be a String enum
   *    containing either 'event' or 'exhibition'.
   *    Used to determine the type of activity attendanceName represents.
   * @param {function} callback: A function that executes once the
   *    operation is done.
   */
  static deleteAttendance(userEmail, attendanceName, attendanceType, callback) {
    const query = { user_email: userEmail,
      attendance_name: attendanceName,
      attendance_type: attendanceType,
    };
    Attendance.connectDB();
    this.AttendanceModel.findOneAndRemove(query, (err) => {
      Attendance.disconnectDB();
      callback(err);
    });
  }

  /**
   * Remove the collection of Attendances from the Database.
   *
   * @param {function} callback: A function that is executed once the
   *    operation completes.
   */
  static clearAllAttendances(callback) {
    Attendance.connectDB();
    this.AttendanceModel.collection.remove({}, (err, results) => {
      Attendance.disconnectDB();
      callback(err, results);
    });
  }
}
module.exports = Attendance;
