const config = require('../server/config.json').fakeDbUri;
const ModelHandler = require('../server/database/models/ourModels');
const Event = require('../server/database/objectClasses/Event.js');
const Exhibition = require('../server/database/objectClasses/Exhibition.js');
const Attendance = require('../server/database/objectClasses/Attendance.js');
const assert = require('assert');

let ModelHandlerObj;
describe('Attendance Create', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithParameters(
        config.username,
        config.password,
        config.host,
        config.port,
        config.database);

    Event.setDBConnection(ModelHandlerObj.getConnection());
    Exhibition.setDBConnection(ModelHandlerObj.getConnection());
    Attendance.setDBConnection(ModelHandlerObj.getConnection());

    const testexhibition1 = new Exhibition(
      'MAMA! LAVA!',
      'The description of the exhibition',
      'STEPS',
      'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg',
      ['https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1', 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1'],
      ['www.youtube.com', 'www.youtube.com'],
      'url.com',
      ['game', 'software engineering'],
    );
    testexhibition1.saveExhibition((err, result) => {
      if (err) {
        console.log(err);
      }
      const attendance1 = new Attendance(
        'usertesting_1@user.com',
        result._id,
        'exhibition',
        ['finding investors', 'finding collabrators'],
      );
      attendance1.saveAttendance((err) => {
        if (err) {
          console.log(err);
        }
        const testevent1 = new Event(
          'eventTest1',
          'description',
          new Date('October 13, 2014 11:13:00'),
          new Date('October 14, 2014 21:00:00'),
          'NUS',
          'map',
          'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1',
          ['game', 'software engineering'],
        );
        testevent1.saveEvent((err, result) => {
          if (err) {
            console.log(err);
          }
          done();
        });
      });
    });
  });

  after((done) => {
    Attendance.clearAllAttendances((err) => {
      if (err) {
        console.log(err);
      }
      Exhibition.clearAllExhibitions((err) => {
        if (err) {
          console.log(err);
        }
        Event.clearAllEvents((err) => {
          if (err) {
            console.log(err);
          }
          ModelHandlerObj.disconnect(() => {
            done();
          });
        });
      });
    });
  });

  it('Should be able to add a new exhibition attendance', (done) => {
    // obtain exhibition_id
    Exhibition.getExhibition('STEPS', 'MAMA! LAVA!', (err, result) => {
      if (err) {
        console.log(err);
        done();
      } else {
        const attendance2 = new Attendance(
          'usertesting_2@user.com',
          result._id,
          'exhibition',
          ['finding investors', 'finding collabrators'],
        );
        attendance2.saveAttendance((err) => {
          if (err) {
            console.log(err);
          }
          Attendance.searchAttendancesByUser('usertesting_2@user.com', (err, attendanceObj) => {
            if (err) {
              console.log('not able to get object');
              console.log(err);
            } else if (attendanceObj) {
              assert.equal(attendanceObj[0].attendance_type, 'exhibition');
            } else {
              console.log('Attendance Object not found');
            }
            done();
          });
        });
      }
    });
  });

  it('Should be able to add a new event attendance', (done) => {
    // obtain event_id
    Event.getEvent('eventTest1', (err, result) => {
      if (err) {
        console.log(err);
        done();
      } else {
        const attendance3 = new Attendance(
          'usertesting_3@user.com',
          result._id,
          'event',
          ['finding collabrators'],
        );
        attendance3.saveAttendance((err) => {
          if (err) {
            console.log(err);
          }
          Attendance.searchAttendancesByUser('usertesting_3@user.com', (err, attendanceObj) => {
            if (err) {
              console.log('not able to get object');
              console.log(err);
            } else if (attendanceObj) {
              assert.equal(attendanceObj[0].attendance_type, 'event');
            } else {
              console.log('Attendance Object not found');
            }
            done();
          });
        });
      }
    });
  });
});

describe('Attendance Read', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithParameters(
        config.username,
        config.password,
        config.host,
        config.port,
        config.database);

    Event.setDBConnection(ModelHandlerObj.getConnection());
    Exhibition.setDBConnection(ModelHandlerObj.getConnection());
    Attendance.setDBConnection(ModelHandlerObj.getConnection());

    const testexhibition1 = new Exhibition(
      'MAMA! LAVA!',
      'The description of the exhibition',
      'STEPS',
      'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg',
      ['https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1', 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1'],
      ['www.youtube.com', 'www.youtube.com'],
      'url.com',
      ['game', 'software engineering'],
    );
    testexhibition1.saveExhibition((err, result) => {
      if (err) {
        console.log(err);
      }
      const attendance1 = new Attendance(
        'usertesting_2@user.com',
        result._id,
        'exhibition',
        ['finding investors', 'finding collaborators'],
      );
      attendance1.saveAttendance((err) => {
        if (err) {
          console.log(err);
        }
        done();
      });
    });
  });

  after((done) => {
    Attendance.clearAllAttendances((err) => {
      if (err) {
        console.log(err);
      }
      Exhibition.clearAllExhibitions((err) => {
        if (err) {
          console.log(err);
        }
        ModelHandlerObj.disconnect(() => {
          done();
        });
      });
    });
  });

  it('should be able to retrieve an array AttendanceObj by user email', (done) => {
    Attendance.searchAttendancesByUser('usertesting_2@user.com', (err, obj) => {
      if (err) {
        console.log('unable to get attendance object');
      } else {
        assert.equal(obj[0].reason[0], 'finding investors');
      }
      done();
    });
  });

  it('should be able to retrieve an array of AttendanceObj by attendance_key', (done) => {
    Exhibition.getExhibition('STEPS', 'MAMA! LAVA!', (err, result) => {
      if (err) {
        console.log(err);
        done();
      } else {
        Attendance.searchAttendancesByKey(result._id, (err, obj) => {
          if (err) {
            console.log('unable to get attendance object');
          } else {
            assert.equal(obj[0].attendance_type, 'exhibition');
          }
          done();
        });
      }
    });
  });

  it('should be able to retrieve an array of AttendanceObj by reasons', (done) => {
    Attendance.searchAttendancesByReason('investors', (err, obj) => {
      if (err) {
        console.log('unable to get attendance object');
      } else {
        assert.notEqual(obj[0], null);
      }
      done();
    });
  });

  /**
   * key can be used to get:
   * list of guests (using event ID),
   * list of teammates (using exhibition ID)
   */
  it('should be able to retrieve an array of AttendanceObj by attendance key and reasons', (done) => {
    Exhibition.getExhibition('STEPS', 'MAMA! LAVA!', (err, result) => {
      if (err) {
        console.log(err);
        done();
      } else {
        Attendance.searchAttendancesByKeyAndReason(result._id, 'investor', (err, obj) => {
          if (err) {
            console.log('unable to get attendance object');
          } else {
            assert.notEqual(obj[0], null);
          }
          done();
        });
      }
    });
  });

  it('should be able to obtain a specific AttedanceObj using email and key', (done) => {
    Exhibition.getExhibition('STEPS', 'MAMA! LAVA!', (err, result) => {
      if (err) {
        console.log(err);
        done();
      } else {
        Attendance.getAttendance('usertesting_2@user.com', result._id, (err, obj) => {
          if (err) {
            console.log(err);
          } else {
            assert.equal(obj.attendance_type, 'exhibition');
          }
          done();
        });
      }
    });
  });
});

describe('Attendance Update', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithParameters(
        config.username,
        config.password,
        config.host,
        config.port,
        config.database);

    Event.setDBConnection(ModelHandlerObj.getConnection());
    Exhibition.setDBConnection(ModelHandlerObj.getConnection());
    Attendance.setDBConnection(ModelHandlerObj.getConnection());

    const testexhibition1 = new Exhibition(
      'MAMA! LAVA!',
      'The description of the exhibition',
      'STEPS',
      'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg',
      ['https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1', 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1'],
      ['www.youtube.com', 'www.youtube.com'],
      'url.com',
      ['game', 'software engineering'],
    );
    testexhibition1.saveExhibition((err, result) => {
      if (err) {
        console.log(err);
      }
      const attendance1 = new Attendance(
        'usertesting_3@user.com',
        result._id,
        'event',
        ['finding investors', 'finding collabrators'],
      );
      attendance1.saveAttendance((err) => {
        if (err) {
          console.log(err);
        }
        done();
      });
    });
  });

  after((done) => {
    Attendance.clearAllAttendances((err) => {
      if (err) {
        console.log(err);
      }
      Exhibition.clearAllExhibitions((err) => {
        if (err) {
          console.log(err);
        }
        ModelHandlerObj.disconnect(() => {
          done();
        });
      });
    });
  });

  it('should be able to update reasons', (done) => {
    Exhibition.getExhibition('STEPS', 'MAMA! LAVA!', (err, result) => {
      if (err) {
        console.log(err);
        done();
      } else {
        Attendance.updateReason(
          'usertesting_3@user.com',
          result._id,
          ['finding internship', 'anything'],
          (err, obj) => {
            if (err) {
              console.log(err);
            } else if (obj) {
              assert.notEqual(obj, null);
              assert.equal(obj.reason[0], 'finding internship');
            } else {
              console.log('unable to find attendance object. Run test again');
            }
            done();
          });
      }
    });
  });
});

describe('Attendance Delete', () => {
  before((done) => {
    ModelHandlerObj = new ModelHandler().initWithParameters(
        config.username,
        config.password,
        config.host,
        config.port,
        config.database);

    Event.setDBConnection(ModelHandlerObj.getConnection());
    Exhibition.setDBConnection(ModelHandlerObj.getConnection());
    Attendance.setDBConnection(ModelHandlerObj.getConnection());

    const testexhibition1 = new Exhibition(
      'MAMA! LAVA!',
      'The description of the exhibition',
      'STEPS',
      'https://upload.wikimedia.org/wikipedia/en/0/02/My_Neighbor_Totoro_-_Tonari_no_Totoro_%28Movie_Poster%29.jpg',
      ['https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1', 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1'],
      ['www.youtube.com', 'www.youtube.com'],
      'url.com',
      ['game', 'software engineering'],
    );
    testexhibition1.saveExhibition((err, result) => {
      if (err) {
        console.log(err);
      }
      const attendance1 = new Attendance(
        'usertesting_2@user.com',
        result._id,
        'event',
        ['finding investors', 'finding collabrators'],
      );
      attendance1.saveAttendance((err) => {
        if (err) {
          console.log(err);
        }
        done();
      });
    });
  });

  after((done) => {
    Attendance.clearAllAttendances((err) => {
      if (err) {
        console.log(err);
      }
      Exhibition.clearAllExhibitions((err) => {
        if (err) {
          console.log(err);
        }
        ModelHandlerObj.disconnect(() => {
          done();
        });
      });
    });
  });

  it('should be able to delete attendance', (done) => {
    Exhibition.getExhibition('STEPS', 'MAMA! LAVA!', (err, result) => {
      if (err) {
        console.log(err);
        done();
      } else {
        Attendance.deleteAttendance('usertesting_2@user.com',
                                    result._id,
                                    (err) => {
                                      if (err) {
                                        console.log('unable to delete');
                                      }
          // check to see if it exist
                                      Attendance.searchAttendancesByUser('usertesting_2@user.com',
                                             (err, obj) => {
                                               if (err) {
                                                 console.log('ERROR: unable to retrieve');
                                               } else {
                                                 assert.equal(obj[0], null);
                                               }
                                               done();
                                             });
                                    });
      }
    });
  });
});
