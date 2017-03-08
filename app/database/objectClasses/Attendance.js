const ModelHandler = require("../mongodbscripts/models.js");
const User = require("./User.js");
const Event = require("./Event.js");
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
    //check if userEmail and event are existing
    User.isValidUser(userEmail, function callback(err, boolValue){
      if (err){
        console.log("Invalid user error");
      }
      else if (!boolValue){
        console.log (userEmail+" is not found in database.");
        Attendance.canSave = false;
      } else {
        Event.isExistingEvent(attendanceName, function callback(err1, boolValue1){
          if (err1){
            console.log("Event does not exist error");
          } else if (!boolValue1){
            console.log(attendanceName + " does not exist in database");
            Attendance.canSave = false;
          }
        });
      }
    });

  }

  saveAttendance(callback){
    Attendance.connectDB();
    if (this.canSave){
      this.attendanceModelDoc.save(function (err){
        if (err){
          callback(err);
        }
      });
    } else {
      console.log("Attendance is not saved");
    }
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

  static searchAttendance(){
    Attendance.connectDB();
    Attendance.disconnectDB();
  }
}
module.exports = Attendance;