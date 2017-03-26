/**
 * This file contains a script to populate the a target database with
 * information that can be used for our own App based on all the information on the STePs DB.
 * Ensure that both the src and dest MongoDB server connections are running before executing.
 */

const config = require('../../config');

const src = config.stepsDbUri;
const dest = config.devDbUri;

// For ensuring all tasks are completed before db closes

const async = require('async');

// Obtain the Models of the STePs DB
const ModelHandler = require('../models/ourModels');
const StepsModelHandler = require('../models/stepsModels');

const Models = new ModelHandler()
    .initWithParameters(dest.username, dest.password,
        dest.host, dest.port,
        dest.database);

const User = Models.getUserModel();
const Event = Models.getEventModel();
const Exhibition = Models.getExhibitionModel();
const Attendance = Models.getAttendanceModel();

const StepsModels = new StepsModelHandler()
    .initWithParameters(src.username, src.password,
        src.host, src.port,
        src.database);

const stepsUser = StepsModels.getUserModel();
const stepsGuest = StepsModels.getGuestModel();
const stepsModule = StepsModels.getModuleModel();
const stepsEvent = StepsModels.getEventModel();

// Helper Functions
const removeDuplicates = require('../../utils/utils').removeDuplicates;

/**
 * An asynchronous function which Upserts a stepsEventObj into our Event Collection.
 *
 * @param {Object} stepsEventObj: A plain JS Object containing a leaned stepsEvent Document.
 * @param {function} callback: Callback to indicate when
 *    this asynchronous function has been completed.
 */
function upsertEvent(stepsEventObj, callback) {
  const eventName = String(stepsEventObj.code).trim();
  const eventDescription = `${stepsEventObj.name} \n ${stepsEventObj.description}`;
  const startDate = new Date(stepsEventObj.startTime);
  const endDate = new Date(stepsEventObj.endTime);
  const eventLocation = stepsEventObj.location;

  let eventPicture = '';

  if (stepsEventObj.promote &&
      stepsEventObj.promote.links.length > 0) {
    eventPicture = stepsEventObj.promote.links[0].url;
  }

  const query = {
    event_name: eventName,
  };
  const update = {
    event_name: eventName,
    event_description: eventDescription,
    start_date: startDate,
    end_date: endDate,
    event_location: eventLocation,
    event_picture: eventPicture,
  };

  Event.findOneAndUpdate(query, update, {
    upsert: true,
    setDefaultsOnInsert: true,
  }, (err) => {
    if (err) {
      console.log('Cannot upsert Event!');
    }
    callback(null);
  });
}

/**
 * An asynchronous function which Upserts a stepsUserObj into our User Collection.
 *
 * @param {Object} stepsUserObj: A plain JS Object containing a leaned stepsUser Document.
 * @param {function} callback: Callback to indicate when
 *    this asynchronous function has been completed.
 */
function upsertUser(stepsUserObj, callback) {
  const userEmail = String(stepsUserObj.email).trim();
  const userName = stepsUserObj.name.trim();
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
    setDefaultsOnInsert: true,
  }, (err) => {
    if (err) {
      console.log('Cannot upsert User!');
    }
    callback(null);
  });
}

/**
 * An asynchronous function which Upserts information from a stepsModuleObj
 * into our Exhibition and Attendances Collection.
 *
 * Possible Integrity Issue 1:
 * Projects which have the Same Name within the Same Module in the Same Event
 * will not be inserted correctly.
 *
 * Possible Integrity Issue 2:
 * Projects which change Names will spawn new
 * Exhibition Entries and Attendance Records.
 *
 * Possible Integrity Issue 3:
 * If the same User participates in several Projects from the same Module,
 * a duplicate key error may be thrown.
 *
 * @param {Object} stepsModuleObj: A plain JS Object containing a leaned stepsModule Document.
 * @param {function} callback: Callback to indicate when
 *    this asynchronous function has been completed.
 */
function upsertModule(stepsModuleObj, callback) {
  async.waterfall([
    (callback) => { // Extract out the relevant information in each Module
      callback(null, {
        eventName: String(stepsModuleObj.event).trim(),
        tag: stepsModuleObj.code.toLowerCase().trim(),
        projects: stepsModuleObj.projects,
      });
    },
    (collectedInformation, callback) => {
      async.eachLimit(collectedInformation.projects, 5, (project, callback) => {
        // For each Project in parallel, 5 at a time
        async.waterfall([
          (callback) => {
            // Extract out the relevant information in each Project -
            // the Exhibition Properties, and the Students involved in each Exhibition
            const exhibitionName = String(`${collectedInformation.tag.toUpperCase()}: ${project.name}`).trim();
            const eventName = String(collectedInformation.eventName).trim();

            const exhibitionDescription = project.description;
            const posterLink = project.posterLink;

            let imagesList = [];
            const imageLinks = project.imageLinks;
            if (imageLinks.length > 0) {
              imagesList = imagesList.concat(imageLinks);
            }

            const videosList = [];
            const videoLink = project.videoLink;
            if (videoLink !== '') {
              videosList.push(videoLink);
            }

            const websiteLink = project.urlLink;

            const tagsList = [];
            tagsList.push(eventName.trim().toLowerCase());
            tagsList.push(collectedInformation.tag.trim().toLowerCase());

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
            if ((project.name !== 'Unknown') && (project.name !== '')) {
              valid = true;
            }

            callback(null, exhibitionProperties, studentsInvolved, valid);
          },
          (exhibitionProperties, studentsInvolved, valid, callback) => {
            // Upsert an Exhibition Listing,
            // only if the Event exists and Project Information was valid
            if (valid) {
              const eventQuery = {
                event_name: exhibitionProperties.eventNameKey,
              };
              const exhibitionQuery = {
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

              // Check if Event exists
              Event.where(eventQuery).lean().findOne((err, event) => {
                if (err) {
                  // Unknown Error
                  console.log('Cannot search for the Event when upserting Module!');
                  callback(null, null, null, null, false);
                } else if (event) {
                  // Event exists - Upsert Exhibition
                  Exhibition.where(exhibitionQuery).findOne((err, exhibition) => {
                    if (err) {
                      // Unknown Error
                      console.log('Cannot search for the Exhibition when upserting Module!');
                      callback(null, null, null, null, false);
                    } else if (exhibition) {
                      // Exhibition was Previously Inserted - Update
                      exhibition.set('exhibition_name', update.exhibition_name);
                      exhibition.set('event_name', update.event_name);
                      exhibition.set('exhibition_description', update.exhibition_description);
                      exhibition.set('poster', update.poster);
                      exhibition.set('website', update.website);

                      exhibition.set('images', removeDuplicates(exhibition.get('images').concat(exhibitionProperties.imagesListKey)));
                      exhibition.set('videos', removeDuplicates(exhibition.get('videos').concat(exhibitionProperties.videosListKey)));
                      exhibition.set('tags', removeDuplicates(exhibition.get('tags').concat(exhibitionProperties.tagsListKey)));

                      exhibition.save((err) => {
                        if (err) {
                          console.log('Cannot update Exhibition Document when upserting Module!');
                          callback(null, null, null, null, false);
                        } else {
                          callback(null, exhibition._id,
                                event._id, studentsInvolved, true);
                        }
                      });
                    } else {
                      // Exhibition is a Potential New Entry - Insert
                      const exhibitionDoc = new Exhibition(update);
                      exhibitionDoc.set('images', exhibitionProperties.imagesListKey);
                      exhibitionDoc.set('videos', exhibitionProperties.videosListKey);
                      exhibitionDoc.set('tags', exhibitionProperties.tagsListKey);
                      exhibitionDoc.save((err) => {
                        if (err) {
                          console.log('Cannot insert Exhibition Document when upserting Module!');
                          callback(null, null, null, null, false);
                        } else {
                          callback(null, exhibitionDoc._id,
                                event._id, studentsInvolved, true);
                        }
                      });
                    }
                  });
                } else {
                  // Event does not exist - Exhibition info not valid
                  callback(null, null, null, null, false);
                }
              });
            } else {
              callback(null, null, null, null, false);
            }
          },
          (exhibitionKey, eventKey, studentsInvolved, valid, callback) => {
            // Upsert an Attendance Listing for Each User involved in the Project,
            // only if Project Information was valid
            if (valid) {
              async.eachLimit(studentsInvolved, 5, (studentId, callback) => {
                stepsUser.findById(studentId).lean().exec((err, student) => {
                  if (err) {
                    console.log('Cannot search for stepsUser for a Project when upserting Module!');
                    callback(null);
                  } else if (student) {
                    const userQuery = {
                      email: String(student.email).trim(),
                    };

                    // Upsert Attendance
                    User.where(userQuery).lean().findOne((err, user) => {
                      if (err) {
                        // Unknown Error
                        console.log('Cannot search for a User when upserting Module!');
                        callback(null);
                      } else if (user) {
                        // User exists
                        // Upsert both eventAttendance and exhibitionAttendance
                        async.waterfall([
                          (callback) => {
                            // eventAttendance
                            const eventAttendanceQuery = {
                              user_email: userQuery.email,
                              attendance_type: 'event',
                              attendance_key: eventKey,
                            };
                            Attendance.where(eventAttendanceQuery)
                                .findOne((err, eventAttendance) => {
                                  if (err) {
                                    // Unknown Error
                                    console.log('Cannot search for a pre-existing Attendance Document when trying to upsert the Attendance');
                                    callback(null, false);
                                  } else if (eventAttendance) {
                                    // Don't do anything if eventAttendance document exists
                                    callback(null, true);
                                  } else {
                                    // eventAttendance document does not already exist - Insert
                                    const eventAttendanceDoc = new Attendance(eventAttendanceQuery);
                                    eventAttendanceDoc.save((err) => {
                                      if (err) {
                                        console.log(err);
                                        callback(null, false);
                                      } else {
                                        callback(null, true);
                                      }
                                    });
                                  }
                                });
                          },
                          (valid, callback) => {
                            // exhibitionAttendance
                            if (valid) {
                              const exhibitionAttendanceQuery = {
                                user_email: userQuery.email,
                                attendance_type: 'exhibition',
                                attendance_key: exhibitionKey,
                              };
                              Attendance.where(exhibitionAttendanceQuery)
                                    .findOne((err, exhibitionAttendance) => {
                                      if (err) {
                                            // Unknown Error
                                        console.log(err);
                                        callback(null);
                                      } else if (exhibitionAttendance) {
                                        // Don't do anything if exhibitionAttendance document exists
                                        callback(null);
                                      } else {
                                        // exhibitionAttendance document does not already exist
                                          // - Insert
                                        const exhibitionAttendanceDoc =
                                            new Attendance(exhibitionAttendanceQuery);
                                        exhibitionAttendanceDoc.save((err) => {
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
                          },
                        ], callback);
                      } else {
                        // User not Inserted before -
                        // should have been inserted when reading in the STePs _User Collection
                        callback(null);
                      }
                    });
                  } else {
                    callback(null);
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

/**
 * An asynchronous function which Upserts information from a stepsGuestObj
 * into our User and Attendances Collection.
 *
 * @param {Object} stepsGuestObj: A plain JS Object containing a leaned stepsGuest Document.
 * @param {function} callback: Callback to indicate when
 *    this asynchronous function has been completed.
 */
function upsertGuest(stepsGuestObj, callback) {
  async.waterfall([
    (callback) => { // Extract out relevant information from each Guest
      const eventName = String(stepsGuestObj.event).trim();

      const userName = stepsGuestObj.name.trim();
      const userPassword = '';

      let userEmail = '';
      if (stepsGuestObj.email === 'abc@temp.com') {
        // To accommodate for sanitized Emails in STePs DB
        User.where({ name: userName }).lean().find((err, matchedUsers) => {
          // Try to get true Email via Name
          if (err) {
            // Unknown Error
            console.log(err);
            callback(null, userEmail, userPassword, userName, eventName, false);
          } else if (matchedUsers && matchedUsers.length === 1) {
            // If Name is Unique
            userEmail = matchedUsers[0].email.trim();
            callback(null, userEmail, userPassword, userName, eventName, true);
          } else {
            // Name not Unique or User non-existing
            userEmail = String(`${stepsGuestObj._id}@temp.com`).trim();
            callback(null, userEmail, userPassword, userName, eventName, true);
          }
        });
      } else {
        userEmail = stepsGuestObj.email.trim();
        callback(null, userEmail, userPassword, userName, eventName, true);
      }
    },
    (userEmail, userPassword, userName, eventName, valid, callback) => {
      // Upsert Guests into User Collection
      if (valid) {
        const query = {
          email: userEmail,
        };

        const update = {
          email: userEmail,
          name: userName,
          password: userPassword,
        };

        User.findOneAndUpdate(query, update,
            { new: true, upsert: true, setDefaultsOnInsert: true }, (err) => {
              if (err) {
                console.log('Cannot upsert User when upserting Guests!');
              }

              async.setImmediate(() => {
                callback(null, userEmail, eventName, valid);
              });
            });
      } else {
        callback(null, userEmail, eventName, valid);
      }
    },
    (userEmail, eventName, valid, callback) => {
      // Upsert an Attendance Listing for Each Guest Per Event
      if (valid) {
        const userQuery = {
          email: userEmail,
        };
        const eventQuery = {
          event_name: eventName,
        };

        User.where(userQuery).lean().findOne((err, user) => {
          if (err) {
            // Unknown Error
            console.log(err);
            callback(null);
          } else if (user) {
            // User was Previously Inserted
            Event.where(eventQuery).lean().findOne((err, event) => {
              if (err) {
                // Unknown Error
                console.log(err);
                callback(null);
              } else if (event) {
                // User and Event found - Upsert Attendance Document
                const attendanceEventQuery = {
                  user_email: userEmail,
                  attendance_key: event._id,
                  attendance_type: 'event',
                };

                Attendance.where(attendanceEventQuery).lean().findOne((err, eventAttendance) => {
                  if (err) {
                    // Unknown Error
                    console.log(err);
                    callback(null);
                  } else if (eventAttendance) {
                    // Don't do anything if Attendance Document already exists
                    callback(null);
                  } else {
                    // Attendance Record does not exist - Insert
                    const attendanceDoc = new Attendance(attendanceEventQuery);
                    attendanceDoc.save((err) => {
                      if (err) {
                        console.log(err);
                      }
                      callback(null);
                    });
                  }
                });
              } else { // Event was not Previously Inserted
                callback(null);
              }
            });
          } else { // User was not Previously Inserted
            callback(null);
          }
        });
      } else {
        callback(null);
      }
    },
  ], callback);
}

// Start

async.series([
  (callback) => {
    // Bring in Events
    async.waterfall(
      [
        (callback) => {
          // Obtain all Events in the STePs DB
          stepsEvent.where({}).lean().find((err, allEvents) => {
            if (err) {
              console.log(err);
            }
            callback(null, allEvents);
          });
        },
        (allEvents, callback) => {
          // Upsert each STePs Event into our Event Collection
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
  (callback) => {
    // Bring in _Users
    async.waterfall([
      (callback) => {
        // Obtain all _Users from the STePs DB.
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
  (callback) => {
    // Bring in Projects and Create Attendance Documents
    // for each Student Participant in each Project
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
        async.eachLimit(allModules, 1, upsertModule, (err) => {
          if (err) {
            console.log(err);
          }
          callback(null);
        });
      },
    ], callback);
    // End: Bring in Exhibitions
  },
  (callback) => {
    // Bring in Guests and Create Attendance Documents for each Guest for each Event
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
        async.eachLimit(allGuests, 15, upsertGuest, (err) => {
          if (err) {
            console.log(err);
          }
          callback(null);
        });
      },
    ], callback);
    // End: Bring in Guests
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
