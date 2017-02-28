var ModelHandler = require("../mongodbscripts/models.js");
const port = "27017";
const host = "localhost";
const dbName = "fake-data";

class Attendance{
    //ASSUMPTION: usermail and eventID are checked and existing.
    constructor(userEmail, attendanceName, attendanceType,reason) {
      this.ModelHandler = new ModelHandler(host, port, db);
      this.attendanceModel = this.ModelHandler.getAttendanceModel();
      this.attendanceModelDoc = new this.attendanceModel({
        user_email:UserEmail,
        attendance_name: attendance_name,
        attendance_type: attendanceType,
        reason: reason,
      });
     this.attendanceModelDoc.save(function (err){
       if (err){
         console.log("Unable to save new attendance");
       }
     });   
    }
}
module.exports = Attendance;