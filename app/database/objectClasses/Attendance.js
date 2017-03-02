var ModelHandler = require("../mongodbscripts/models.js");
const port = "27017";
const host = "localhost";
const dbName = "fake-data";

class Attendance{
  //ASSUMPTION: usermail and eventID are checked and existing.
  constructor(userEmail, attendanceName, attendanceType,reason) {
    this.ModelHandler = new ModelHandler(host, port, dbName);
    this.attendanceModel = this.ModelHandler.getAttendanceModel();
    this.attendanceModelDoc = new this.attendanceModel({
      user_email:userEmail,
      attendance_name: attendanceName,
      attendance_type: attendanceType,
      reason: reason,
    });
    this.attendanceModelDoc.save(function (err){
      if (err){
        console.log("Unable to save new attendance");
        console.log(err);
      }
    });   
    this.ModelHandler.disconnect();
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
  static clearAllAttendance(){
    Attendance.connectDB();
    this.attendanceModel.collection.remove({});
    Attendance.disconnectDB();
  }

  static getAttendanceObj(callback){
    Attendance.connectDB();
    this.attendanceModel.find({});
    Attendance.disconnectDB();
  }
}
module.exports = Attendance;