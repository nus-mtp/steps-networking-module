const ModelHandler = require("../mongodbscripts/models.js");
const port = "27017";
const host = "localhost";
const dbName = "fake-data";

class Attendance{
  /**
   * Creates a new model instance of Attendance
   *
   * @param {String} userEmail: identifer for users. Must be existing
   * @param {String} attendanceName: Name of event/ exhibition
   * @param {String} attendanceType: "exhibition" or "event". Exhibition if they are participating as exhibitor, event otherwise.
   * @param {String} reason: user's reason for attending the event. Each element has to be unique.
   */
  constructor(userEmail, attendanceName, attendanceType, reason) {
    this.canSave = true;
    this.ModelHandler = new ModelHandler(host, port, dbName);
    this.attendanceModel = this.ModelHandler.getAttendanceModel();
    this.attendanceModelDoc = new this.attendanceModel({
      user_email:userEmail,
      attendance_name: attendanceName,
      attendance_type: attendanceType,
      reason: reason,
    });
  }

  saveAttendance(callback){
    Attendance.connectDB();
    this.attendanceModelDoc.save(function (err){
      if (err){
        callback(err);
      }
    });
    Attendance.disconnectDB();
  }
  static connectDB(){
    this.ModelHandler = new ModelHandler (host, port, dbName);
    this.attendanceModel = this.ModelHandler.getAttendanceModel();
  }

  static disconnectDB(){
    this.ModelHandler.disconnect();
  }

  static getAllAttendance(callback){
    Attendance.connectDB();
    this.attendanceModel.find({},function (err,userDoc){
      if (err){
        callback(err,null);
      } else{
        callback(null,userDoc);
      }
    });
    Attendance.disconnectDB();
  }

  /**
   * Remove the collection of Users from database
   */
  static clearAllAttendance(callback){
    Attendance.connectDB();
    this.attendanceModel.collection.remove({},callback);
    Attendance.disconnectDB();
  }

  static getAttendanceObj(userEmail, callback){
    Attendance.connectDB();
    this.attendanceModel.find({user_email: userEmail}, function (err, obj){
      if (err){
        callback(err, null)
      } else {
        callback(null, obj);
      }
    });
    Attendance.disconnectDB();
  }

  static searchAttendanceByEvent(eventName, callback){
    Attendance.connectDB();
    this.attendanceModel.find({attendance_name: eventName}, function (err, obj){
      if (err){
        callback(err, null)
      } else {
        callback(null, obj);
      }
    });
    Attendance.disconnectDB();
  }
}
module.exports = Attendance;