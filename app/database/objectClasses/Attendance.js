const ModelHandler = require('../../../server/database/models/ourModels.js');

const username = '';
const password = '';
const port = '27017';
const host = 'localhost';
const dbName = 'dev';

class Attendance {
  /**
   * Creates a new model instance of Attendance
   *
   * @param {String} userEmail: identifer for users. Must be existing
   * @param {String} attendanceName: Name of event/ exhibition.
   *                Use attendanceType to determine if the name is for an Exhibition, or an Event.
   * @param {String} attendanceType: 'exhibition' or 'event'. Exhibition if they are participating
   *                as exhibitor, event otherwise.
   * @param {String} reason: user's reason for attending the event. Each element has to be unique.
   */
  constructor(userEmail, attendanceName, attendanceType, reason) {
    this.ModelHandler = new ModelHandler().initWithParameters(username, password, host, port, dbName);
    this.AttenanceModel = this.ModelHandler.getAttendanceModel();
    this.attendanceModelDoc = new this.AttenanceModel({
      user_email: userEmail,
      attendance_name: attendanceName,
      attendance_type: attendanceType,
      reason: reason,
    });
    this.ModelHandler.disconnect();
  }

  /**
   * Saves the attendance into the database
   *
   * @param {Function} callback: used for error checking
   */
  saveAttendance(callback) {
    Attendance.connectDB();
    this.attendanceModelDoc.save(function cb(err) {
      callback(err);
    });
    Attendance.disconnectDB();
  }

  static connectDB() {
    this.ModelHandler = new ModelHandler().initWithParameters(username, password, host, port, dbName);
    this.AttenanceModel = this.ModelHandler.getAttendanceModel();
  }

  static disconnectDB() {
    this.ModelHandler.disconnect();
  }

  /**
   * Retrieve an array of attendance object from database
   *
   * @param {Function} callback (err, objArray): err is used for error checking,
                                                objArray is the array of attendance object
   */
  static getAllAttendance(callback) {
    Attendance.connectDB();
    this.AttenanceModel.find({}, function cb(err, userDoc) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, userDoc);
      }
    });
    Attendance.disconnectDB();
  }

  /**
   * Remove the collection of Users from database
   *
   * @param {Function} callback: used for error checking
   */
  static clearAllAttendance(callback) {
    Attendance.connectDB();
    this.AttenanceModel.collection.remove({}, callback);
    Attendance.disconnectDB();
  }

  /**
   * Retrieve the specific attendance object from the database
   * Using the user email, attendance name and type as the unique identifer.
   *
   * @param {String} userEmail: identifer for users. Must be existing
   * @param {String} attendanceName: Name of event/ exhibition.
   * @param {String} attendanceType: 'exhibition' or 'event'.
   * @param {Function} callback: user's reason for attending the event.
   */
  static getAttendanceObj(userEmail, attendanceName, attendanceType, callback) {
    Attendance.connectDB();
    const query = { user_email: userEmail,
                   attendance_name: attendanceName,
                   attendance_type: attendanceType,
                  };
    this.AttenanceModel.findOne(query, function cb(err, obj) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, obj);
      }
    });
    Attendance.disconnectDB();
  }

  /**
   * Retrieve the attendance object with the user-defined userEmail
   *
   * @param {String} userEmail: the unique identifer to search in the database
   * @param {Function} callback: used to return Attendance Object and error checking
   */
  static searchAttendanceByUser(userEmail, callback) {
    Attendance.connectDB();
    this.AttenanceModel.find({ user_email: userEmail }, function cb(err, obj) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, obj);
      }
    });
    Attendance.disconnectDB();
  }

  /**
   * Retrieve the attendance object using attendance name
   *
   * @param {String} userEmail: the unique identifer to search in the database
   * @param {Function} callback: used to return an array ofAttendance Object and error checking
   */
  static searchAttendanceByEvent(eventName, callback) {
    Attendance.connectDB();
    this.AttenanceModel.find({ attendance_name: eventName }, function cb(err, obj) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, obj);
      }
    });
    Attendance.disconnectDB();
  }

  /**
   * Retrieve the attendance object using reasons
   *
   * @param {String} reason: the unique identifer to search in the database
   * @param {Function} callback: used to return an array ofAttendance Object and error checking
   */
  static searchAttendanceByReason(reason, callback) {
    Attendance.connectDB();
    this.AttenanceModel.find({ reason: { $regex: new RegExp(reason.replace('+', '\\+'), 'i') } }, function cb(err, obj) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, obj);
      }
    });
    Attendance.disconnectDB();
  }

  /**
   * Retrieve the attendance object using both reasons and attendance name
   *
   * @param {String} attendanceName: part of the identifer used to search database
   * @param {String} reason: part of the identifer to search in the database
   * @param {Function} callback: used to return an array ofAttendance Object and error checking
   */
  static searchAttendanceByEventAndReason(attendanceName, reason, callback) {
    Attendance.connectDB();
    const query = { attendance_name: attendanceName,
                   reason: { $regex: new RegExp(reason.replace('+', '\\+'), 'i') },
                  };
    this.AttenanceModel.find(query, function cb(err, obj) {
      if (err) {
        callback(err, null);
      } else {
        callback(null, obj);
      }
    });
    Attendance.disconnectDB();
  }

  /**
   * Update instance of Attendance
   *
   * @param {String} userEmail: identifer for users. Must be existing.
   * @param {String} attendanceName: Name of event/ exhibition.
   * @param {String} attendanceType: 'exhibition' or 'event'.
   * @param {String} reason: user's reason for attending the event. Each element has to be unique.
   * @param {Function} callback: used for error checking and returning updated object.
   */
  static updateReason(userEmail, attendanceName, attendanceType, reason, callback) {
    Attendance.connectDB();
    const query = { user_email: userEmail,
                   attendance_name: attendanceName,
                   attendance_type: attendanceType,
                  };
    const update = { reason: reason };
    const options = { new: true };
    this.AttenanceModel.findOneAndUpdate(query, update, options,
                                         function cb(err, results) {
      if (err) {
        console.log('Unable to update reasons');
        callback(err);
      } else {
        console.log('reasons are updated.');
        callback(null, results);
      }
    });

    Attendance.disconnectDB();
  }

  /**
   * Deletes an Attendance instance from database
   *
   *
   */
  static deleteAttendace(userEmail, attendanceName, attendanceType, callback) {
    const query = { user_email: userEmail,
                   attendance_name: attendanceName,
                   attendance_type: attendanceType,
                  };
    Attendance.connectDB();
    this.AttenanceModel.findOneAndRemove(query, function cb(err) {
      callback(err);
    });
    Attendance.disconnectDB();
  }

}
module.exports = Attendance;
