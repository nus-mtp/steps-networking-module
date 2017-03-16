const Attendance = require('../server/database/objectClasses/Attendance.js');
const assert = require('assert');

describe('Attendance Create', function() {

  before (function(done) {
    var attendance1 = new Attendance('usertesting_1@user.com',
                                     'eventTest1', 'event',
                                     ['finding investors', 'finding collabrators']
                                    );
    attendance1.saveAttendance(function callback(err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after(function(done) {
    Attendance.clearAllAttendance(function callback(err) {
      if (err) {
        console.log(err);
      }
      done();
    })
  });

  it('Should be able to add a new attendance', function(done) {
    var attendance2 = new Attendance('usertesting_1@user.com',
                                     'eventTest1',
                                     'exhibition',
                                     ['finding investors', 'finding collabrators']
                                    );
    attendance2.saveAttendance(function callback(err) {
      if (err) {
        console.log(err);
      }
      Attendance.searchAttendanceByUser('usertesting_1@user.com', function(err1, attendanceObj) {
        if (err1) {
          console.log('not able to get object');
          console.log(err1);
        } else {
          if(attendanceObj) {
            assert.equal(attendanceObj[0].attendance_name, 'eventTest1');
          }
          else {
            console.log("WHY IS THERE NOTHING!??!?!");
          }
        }
        done();
      });
    });
  });
});

describe('Attendance Read', function() {
  before (function(done) {
    var attendance1 = new Attendance('usertesting_2@user.com',
                                     'eventNumber2', 'exhibition',
                                     ['finding investors', 'finding collabrators']
                                    );
    attendance1.saveAttendance(function callback (err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after(function(done) {
    Attendance.clearAllAttendance(function callback(err) {
      if (err) {
        console.log(err);
      }
      done();
    })
  });

  it('should be able to retrieve an array AttendanceObj by user email', function(done) {
    Attendance.searchAttendanceByUser('usertesting_2@user.com', function(err, obj) {
      if (err) {
        console.log("unable to get attendance object");
      } else {
        assert.equal(obj[0].attendance_name, 'eventNumber2');
      }
      done();
    });
  });

  it('should be able to retrieve an array of AttendanceObj by event name', function(done) {
    Attendance.searchAttendanceByEvent('eventNumber2', function(err, obj) {
      if (err) {
        console.log("unable to get attendance object");
      } else {
        assert.equal(obj[0].attendance_name, 'eventNumber2');
      }
      done();
    });
  });

  it('should be able to retrieve an array of AttendanceObj by reasons', function(done) {
    Attendance.searchAttendanceByReason('investors', function(err, obj) {
      if (err) {
        console.log("unable to get attendance object");
      } else {
        assert.notEqual(obj, null);
      }
      done();
    });
  });

  it('should be able to retrieve an array of AttendanceObj by attendance name and reasons', function(done){
    Attendance.searchAttendanceByEventAndReason('eventNumber2', 'investor', function(err, obj) {
      if (err) {
        console.log("unable to get attendance object");
      } else {
        assert.notEqual(obj, null);
      }
      done();
    });
  });


  it('should be able to obtain a specific AttedanceObj using email, event/exhibit name and type', function(done){
    Attendance.getAttendanceObj('usertesting_2@user.com','eventNumber2','exhibition', function(err, obj) {
      if (err) {
        console.log(err);
      } else {
        assert.equal(obj.reason[0], 'finding investors');
      }
      done();
    })
  });
});

describe('Attendance Update', function() {
  before (function(done){
    var attendance1 = new Attendance('usertesting_3@user.com',
                                     'eventTest3',
                                     'exhibition',
                                     ['seeking investors', 'finding collabrators']
                                    );
    attendance1.saveAttendance(function callback (err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });

  after(function(done) {
    Attendance.clearAllAttendance(function callback(err) {
      if (err) {
        console.log(err);
      }
      done();
    })
  });

  it('should be able to update reasons', function(done) {
    Attendance.updateReason('usertesting_3@user.com',
                            'eventTest3',
                            'exhibition',
                            ['Finding internship'],
                            function callback(err, obj){
      if (err) {
        console.log(err);
      } else if (obj){
        assert.notEqual(obj,null);
        assert.equal(obj.reason[0], 'Finding internship');
      } else {
        console.log("unable to find attendance object. Run test again");
      }

      done();
    });
  });

});

describe('Attendance Delete', function(){
  before (function(done){
    var attendance1 = new Attendance('usertesting_2@user.com', 
                                     'eventNumber2', 'exhibition', 
                                     ['finding investors', 'finding collabrators']
                                    );
    attendance1.saveAttendance(function callback (err){
      if (err){
        console.log(err);
      }
      done();
    });
  });

  after(function(done) {
    Attendance.clearAllAttendance(function callback(err) {
      if (err) {
        console.log(err);
      }
      done();
    })
  });

  it ('should be able to delete attendance', function(done) {
    Attendance.deleteAttendace('usertesting_2@user.com', 
                               'eventNumber2', 'exhibition', 
                               function (err) {
      if (err) {
        console.log("unable to delete");
      }
      //check to see if it exist
      Attendance.getAttendanceObj('usertesting_2@user.com', 
                                  'eventNumber2', 'exhibition', function(err2, obj) {
        if (err2) {
          console.log("ERROR: unable to retrieve");
        } else {
          assert.equal(obj, null);
        }
        done();
      });
    })
  });
});