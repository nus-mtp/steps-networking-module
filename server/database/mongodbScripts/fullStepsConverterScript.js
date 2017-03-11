/*
    This file contains a script to populate the dev database with information that can be used for our own App based on information on the STePs DB.
    Ensure that a MongoDB local server connection is running before executing.
*/

// For ensuring all tasks are completed before db closes

const async = require('async');

// Obtain the Models of the STePs DB

const ModelHandler = require('../models/ourModels');
const StepsModelHandler = require('../models/stepsModels');

const Models = new ModelHandler('localhost', '27017', 'dev');

const User = Models.getUserModel();
const Event = Models.getEventModel();
const Exhibition = Models.getExhibitionModel();
const Attendance = Models.getAttendanceModel();

const StepsModels = new StepsModelHandler('localhost', '27017', 'steps-api-sanitised');

const stepsUser = StepsModels.getUserModel();
const stepsGuest = StepsModels.getGuestModel();
const stepsModule = StepsModels.getModuleModel();
const stepsEvent = StepsModels.getEventModel();

// Helper Functions

/*
  A function which removes all duplicates from a given Array.

  @param {Array} arr: The given Array to remove duplicates from.
  @return {Array}: A copy of the given Array that has no duplicates.
*/
function removeDuplicates(arr) {
  return Array.from(new Set(arr));
}

/*
  An asynchronous function which Upserts a stepsEventObj into our Event Collection.

  @param {Object} stepsEventObj: A plain JS Object containing a leaned stepsEvent Document.
  @param {function}: Callback to indicate when this asynchronous function has been completed.
*/
function upsertEvent(stepsEventObj, callback) {
  const eventName = stepsEventObj.code;
  const eventDescription = stepsEventObj.name + '\n' + stepsEventObj.description;
  const startDate = new Date(stepsEventObj.startTime);
  const endDate = new Date(stepsEventObj.endTime);
  const eventLocation = stepsEventObj.location;

  const query = {
    event_name: eventName,
  };
  const update = {
    event_name: eventName,
    event_description: eventDescription,
    start_date: startDate,
    end_date: endDate,
    event_location: eventLocation,
  };

  Event.findOneAndUpdate(query, update, {
    upsert: true,
  }, (err, event) => {
    if (err) {
      console.log(err);
    }
    callback(null);
  });
}

/*
  An asynchronous function which Upserts a stepsUserObj into our User Collection.

  @param {Object} stepsUserObj: A plain JS Object containing a leaned stepsUser Document.
  @param {function}: Callback to indicate when this asynchronous function has been completed.
*/
function upsertUser(stepsUserObj, callback) {
  const userEmail = stepsUserObj.email;
  const userName = stepsUserObj.name;
  const userPassword = '';

  const query = {
    email: userEmail,
  };
  const update = {
    email: userEmail,
    name: userName,
    password: userPassword,
  };

  User.findOneAndUpdate(query, update, {
    upsert: true,
  }, (err, doc) => {
    if (err) {
      console.log(err);
    }
    callback(null);
  });
}

/*
  An asynchronous function which Upserts information from a stepsModuleObj into our Exhibition and Attendances Collection.

  Possible Integrity Issue 1: Projects which have the Same Name within the Same Event will not be inserted correctly.
  Possible Integrity Issue 2: Projects which change Names will spawn new Exhibition Entries and Attendance Records.

  @param {Object} stepsModuleObj: A plain JS Object containing a leaned stepsModule Document.
  @param {function}: Callback to indicate when this asynchronous function has been completed.
*/
function upsertModule(stepsModuleObj, callback) {
  async.waterfall([
    (callback) => { // Extract out the relevant information in each Module
      callback(null, { eventName: stepsModuleObj.event, tag: stepsModuleObj.code.toLowerCase(), projects: stepsModuleObj.projects });
    },
    (collectedInformation, callback) => { 
      async.eachLimit(collectedInformation.projects, 5, (project, callback) => { // For each Project in parallel, 5 at a time
        async.waterfall([
          (callback) => { // Extract out the relevant information in each Project - the Exhibition Properties, and the Students involved in each Exhibition
            const exhibitionName = project.name;
            const eventName = collectedInformation.eventName;

            const exhibitionDescription = project.description;
            const posterLink = project.posterLink;

            let imagesList = [];
            const imageLinks = project.imageLinks;
            if (imageLinks.length > 0) {
              imagesList = imagesList.concat(imageLinks);
            }

            let videosList = [];
            const videoLink = project.videoLink;
            if (videoLink !== '') {
              videosList.push(videoLink);
            }

            const websiteLink = project.urlLink;

            let tagsList = [];
            tagsList.push(eventName);
            tagsList.push(collectedInformation.tag);

            const exhibitionProperties = {
              exhibitionNameKey: exhibitionName,
              eventNameKey: eventName,
              exhibitionDescriptionKey: exhibitionDescription,
              posterLinkKey: posterLink,
              imagesListKey: imagesList,
              videosListKey: videosList,
              websiteLinkKey: websiteLink,
              tagsListKey: tagsList,
            };

            const studentsInvolved = project.members;

            let valid = false;

            // Ignore Invalid Name Projects
            if ((exhibitionName !== 'Unknown') && (exhibitionName !== '')) {
              valid = true;
            }

            callback(null, exhibitionProperties, studentsInvolved, valid);
          },
          (exhibitionProperties, studentsInvolved, valid, callback) => { // Upsert an Exhibition Listing, only if Project Information was valid
            if (valid) {
              const query = {
                event_name: exhibitionProperties.eventNameKey,
                exhibition_name: exhibitionProperties.exhibitionNameKey,
              };

              const update = {
                exhibition_name: exhibitionProperties.exhibitionNameKey,
                event_name: exhibitionProperties.eventNameKey,
                exhibition_description: exhibitionProperties.exhibitionDescriptionKey,
                poster: exhibitionProperties.posterLinkKey,
                website: exhibitionProperties.websiteLinkKey,
              };

              // Upsert Exhibition
              Exhibition.where(query).findOne((err, doc) => {
                if (err) { // Unknown Error
                  console.log(err);
                  callback(null, exhibitionProperties.exhibitionNameKey, studentsInvolved, valid);
                } else if (doc) { // Exhibition was Previously Inserted - Update
                  doc.set('exhibition_name', update.exhibition_name);
                  doc.set('event_name', update.event_name);
                  doc.set('exhibition_description', update.exhibition_description);
                  doc.set('poster', update.poster);
                  doc.set('website', update.website);

                  doc.set('images', removeDuplicates(doc.get('images').concat(exhibitionProperties.imagesListKey)));
                  doc.set('videos', removeDuplicates(doc.get('videos').concat(exhibitionProperties.videosListKey)));
                  doc.set('tags', removeDuplicates(doc.get('tags').concat(exhibitionProperties.tagsListKey)));

                  doc.save((err, doc) => {
                    if (err) {
                      console.log(err);
                    }
                    callback(null, exhibitionProperties.exhibitionNameKey, studentsInvolved, valid);
                  });
                } else { // Exhibition is a Potential New Entry - Insert
                  const exhibitionDoc = new Exhibition(update);
                  exhibitionDoc.set('images', exhibitionProperties.imagesListKey);
                  exhibitionDoc.set('videos', exhibitionProperties.videosListKey);
                  exhibitionDoc.set('tags', exhibitionProperties.tagsListKey);
                  exhibitionDoc.save((err, doc) => {
                    if (err) {
                      console.log(err);
                    }
                    callback(null, exhibitionProperties.exhibitionNameKey, studentsInvolved, valid);
                  });
                }
              });
            } else {
              callback(null, exhibitionProperties.exhibitionNameKey, studentsInvolved, valid);
            }
          },
          (exhibitionName, studentsInvolved, valid, callback) => { // Upsert an Attendance Listing for Each User involved in the Project, only if Project Information was valid
            if (valid) {
              async.eachLimit(studentsInvolved, 5, (studentId, callback) => {
                stepsUser.findById(studentId).lean().exec((err, student) => {
                  if (err) {
                    console.log(err);
                    callback(null);
                  } else {
                    const userQuery = {
                      email: student.email,
                    };
                    const exhibitionQuery = {
                      exhibition_name: exhibitionName,
                    };
                    const attendanceQuery = {
                      user_email: student.email,
                      attendance_type: 'exhibition',
                      attendance_name: exhibitionName,
                    };

                    User.where(userQuery).lean().findOne((err, user) => {
                      if (err) {
                        console.log(err);
                        callback(null);
                      } else if (user) {
                        Exhibition.where(exhibitionQuery).lean().findOne((err, exhibition) => {
                          if (err) {
                            console.log(err);
                            callback(null);
                          } else if (exhibition) { // Both the User and Exhibition exist - Upsert Attendance Information
                            Attendance.where(attendanceQuery).findOne((err, attendance) => {
                              if (err) {
                                console.log(err);
                                callback(null);
                              } else if (attendance) { // The Attendance Information exists - don't need to Update
                                callback(null);
                              } else { // Attendance Information does not exist - Insert
                                const attendanceDoc = new Attendance(attendanceQuery);
                                attendanceDoc.save((err, doc) => {
                                  if (err) {
                                    console.log(err);
                                  }
                                  callback(null);
                                });
                              }
                            });
                          } else {
                            console.log('Unable to create Attendance Record for Student under: ' + exhibitionName);
                            callback(null);
                          }
                        });
                      } else {
                        callback(null);
                      }
                    });
                  }
                });
              }, (err) => {
                if (err) {
                  console.log(err);
                }
                callback(null);
              });
            } else {
              callback(null);
            }
          },
        ], callback);
      }, (err) => {
        if (err) {
          console.log(err);
        }
        callback(null);
      });
    },
  ], callback);
}

/*
  An asynchronous function which Upserts information from a stepsGuestObj into our User and Attendances Collection.

  @param {Object} stepsGuestObj: A plain JS Object containing a leaned stepsGuest Document.
  @param {function}: Callback to indicate when this asynchronous function has been completed.
*/
function upsertGuests(stepsGuestObj, callback) {
  async.waterfall([
    (callback) => { // Upsert Guests
      const userEmail = stepsGuestObj._id + '@temp.com'; // To accommodate for sanitized Emails in STePs DB
      const userPassword = '';
      const userName = stepsGuestObj.name;

      const query = {
        email: userEmail,
      };

      const update = {
        email: userEmail,
        name: userName, 
        password: userPassword,
      };

      const eventName = stepsGuestObj.event;

      User.findOneAndUpdate(query, update, {new: true, upsert: true}, (err, doc) => {
        if (err) {
          console.log(err);
        }

        async.setImmediate(() => {
          callback(null, userEmail, eventName);
        });
      });
    },
    (userEmail, eventName, callback) => { // Upsert an Attendance Listing for Each Guest Per Event
      const userQuery = {
        email: userEmail, 
      };
      const eventQuery = {
        event_name: eventName,
      };
      const attendanceQuery = {
        user_email: userEmail, 
        attendance_type: 'event',
        attendance_name: eventName,
      };

      User.where(userQuery).lean().findOne((err, user) => {
        if (err) {
          console.log(err);
          callback(null);
        } else if (user) {
          Event.where(eventQuery).lean().findOne((err, event) => {
            if (err) {
              console.log(err);
              callback(null);
            } else if (event) { // User and Event found - Upsert Attendance Document
              Attendance.where(attendanceQuery).lean().findOne((err, attendance) => {
                if (err) {
                  console.log(err);
                  callback(null);
                } else if (attendance) { // Don't do anything if Attendance Document already exists
                  callback(null);
                } else { // Attendance Document does not already exist - Insert
                  const attendanceDoc = new Attendance(attendanceQuery);
                  attendanceDoc.save((err, doc) => {
                    if (err) {
                      console.log(err);
                    }
                    callback(null);
                  });
                }
              });
            } else {
              callback(null);
            }
          });
        } else {
          callback(null);
        }
      });
    },
  ], callback);
}

// Start

async.series([
  (callback) => { // Bring in Events
    async.waterfall(
      [
        (callback) => { // Obtain all Events in the STePs DB
          stepsEvent.where({}).lean().find((err, allEvents) => {
            if (err) {
              console.log(err);
            }
            callback(null, allEvents);
          });
        },
        (allEvents, callback) => { // Upsert each STePs Event into our Event Collection
          async.eachLimit(allEvents, 15, upsertEvent,
          (err) => {
            if (err) {
              console.log(err);
            }
            callback(null);
          });
        },
      ], callback);
    // End: Bring in Events
  },
  (callback) => { // Bring in _Users
    async.waterfall([
      (callback) => { // Obtain all _Users from the STePs DB.
        stepsUser.where({}).find((err, allUsers) => {
          if (err) {
            console.log(err);
          }
          callback(null, allUsers); 
        });
      },
      (allUsers, callback) => {
        async.eachLimit(allUsers, 15, upsertUser, 
        (err) => {
          if (err) {
            console.log(err);
          }
          callback(null);
        });
      },
    ], callback);
    // End: Bring in _Users
  },
  (callback) => { // Bring in Projects and Create Attendance Documents for each Student Participant in each Project
    async.waterfall([
      (callback) => {
        stepsModule.where({}).find((err, allModules) => {
          if (err) {
            console.log(err);
          }
          callback(null, allModules);
        });
      },
      (allModules, callback) => {
        async.eachLimit(allModules, 5, upsertModule, (err) => {
          if (err) {
            console.log(err);
          }
          callback(null);
        });
      },
    ], callback);
    // End: Bring in Exhibitions
  },
  (callback) => { // Bring in Guests and Create Attendance Documents for each Guest for each Event
    async.waterfall([
      (callback) => {
        stepsGuest.where({}).lean().find((err, allGuests) => {
          if (err) {
            console.log(err);
          }
          callback(null, allGuests);
        });
      },
      (allGuests, callback) => {
        async.eachLimit(allGuests, 15, upsertGuests, (err) => {
          if (err) {
            console.log(err);
          }
          callback(null);
        });
      },
    ], callback);
  },
  (callback) => {
    async.parallel([
      (callback) => {
        Models.disconnect(callback);
      }, 
      (callback) => {
        StepsModels.disconnect(callback);
      },
    ], callback);
  },
]);
