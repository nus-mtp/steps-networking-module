/**
 * This file contains a script to populate the a target database with
 * information that can be used for our own App based on all the information on the STePs DB.
 * Ensure that a MongoDB local server connection is running before executing.
 */

const config = require('../../config');

// For ensuring all tasks are completed before db closes

const async = require('async');

// Obtain the Models of the STePs DB
const ModelHandler = require('../models/ourModels');
const StepsModelHandler = require('../models/stepsModels');

const Models = new ModelHandler()
    .initWithParameters(config.devDbUri.username, config.devDbUri.password,
        config.devDbUri.host, config.devDbUri.port,
        config.devDbUri.database);

const User = Models.getUserModel();
const Event = Models.getEventModel();
const Exhibition = Models.getExhibitionModel();
const Attendance = Models.getAttendanceModel();

const StepsModels = new StepsModelHandler()
    .initWithParameters(config.stepsDbUri.username, config.stepsDbUri.password,
        config.stepsDbUri.host, config.stepsDbUri.port,
        config.stepsDbUri.database);

const stepsUser = StepsModels.getUserModel();
const stepsGuest = StepsModels.getGuestModel();
const stepsModule = StepsModels.getModuleModel();
const stepsEvent = StepsModels.getEventModel();

// Helper Functions

/**
 * A function which removes all duplicates from a given Array.
 *
 * @param arr: The given Array to remove duplicates from.
 * @returns {Array}: A copy of the given Array that has no duplicates.
 */
function removeDuplicates(arr) {
  return Array.from(new Set(arr));
}

/**
 * An asynchronous function which Upserts a stepsEventObj into our Event Collection.
 *
 * @param stepsEventObj: A plain JS Object containing a leaned stepsEvent Document.
 * @param callback: Callback to indicate when this asynchronous function has been completed.
 */
function upsertEvent(stepsEventObj, callback) {
  const eventName = String(stepsEventObj.code).trim();
  const eventDescription = `${stepsEventObj.name} \n ${stepsEventObj.description}`;
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
    setDefaultsOnInsert: true,
  }, (err) => {
    if (err) {
      console.log(err);
    }
    callback(null);
  });
}

/**
 * An asynchronous function which Upserts a stepsUserObj into our User Collection.
 *
 * @param stepsUserObj: A plain JS Object containing a leaned stepsUser Document.
 * @param callback: Callback to indicate when this asynchronous function has been completed.
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
      console.log(err);
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
 * @param stepsModuleObj: A plain JS Object containing a leaned stepsModule Document.
 * @param callback: Callback to indicate when this asynchronous function has been completed.
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
      async.eachLimit(collectedInformation.projects, 5, (project, callback) => { // For each Project in parallel, 5 at a time
        async.waterfall([
          (callback) => { // Extract out the relevant information in each Project - the Exhibition Properties, and the Students involved in each Exhibition
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
            if ((project.name !== 'Unknown') && (project.name !== '')) {
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

                  doc.save((err) => {
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
                  exhibitionDoc.save((err) => {
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
                        email: String(student.email).trim(),
                      };
                    const exhibitionQuery = {
                        exhibition_name: String(exhibitionName).trim(),
                      };
                    const attendanceQuery = {
                        user_email: String(student.email).trim(),
                        attendance_type: 'exhibition',
                        attendance_name: String(exhibitionName).trim(),
                      };

                                        // Upsert Attendance
                    User.where(userQuery).lean().findOne((err, user) => {
                        if (err) { // Unknown Error
                            console.log(err);
                            callback(null);
                          } else if (user) { // User Previously Inserted
                              Exhibition.where(exhibitionQuery).lean().findOne((err, exhibition) => {
                                  if (err) { // Unknown Error
                                      console.log(err);
                                      callback(null);
                                    } else if (exhibition) { // Both the User and Exhibition exist - Upsert Attendance Information
                                        Attendance.where(attendanceQuery).findOne((err, attendance) => {
                                            if (err) { // Unknown Error
                                                console.log(err);
                                                callback(null);
                                              } else if (attendance) { // The Attendance Information exists - don't need to Update
                                                  callback(null);
                                                } else { // Attendance Information does not exist - Insert
                                                  const attendanceDoc = new Attendance(attendanceQuery);
                                                  attendanceDoc.save((err) => {
                                                      if (err) {
                                                          console.log(err);
                                                        }
                                                      callback(null);
                                                    });
                                                }
                                          });
                                      } else { // The User was Inserted before, but the Exhibition has not been inserted in the Previous Step
                                        console.log(`Unable to create Attendance Record for Student under: ${exhibitionName}`);
                                        callback(null);
                                      }
                                });
                            } else { // User not Inserted Before - should have been inserted when reading in the STePs _User Collection
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

/**
 * An asynchronous function which Upserts information from a stepsGuestObj
 * into our User and Attendances Collection.
 *
 * @param stepsGuestObj: A plain JS Object containing a leaned stepsGuest Document.
 * @param callback: Callback to indicate when this asynchronous function has been completed.
 */
function upsertGuests(stepsGuestObj, callback) {
  async.waterfall([
    (callback) => { // Extract out relevant information from each Guest
      const eventName = String(stepsGuestObj.event).trim();

      const userName = stepsGuestObj.name.trim();
      const userPassword = '';

      let userEmail = '';
      if (stepsGuestObj.email === 'abc@temp.com') { // To accommodate for sanitized Emails in STePs DB
        User.where({ name: userName }).lean().find((err, matchedUsers) => { // Try to get true Email via Name
          if (err) { // Unknown Error
            console.log(err);
            callback(null, userEmail, userPassword, userName, eventName, false);
          } else if (matchedUsers && matchedUsers.length === 1) { // If Name is Unique
            userEmail = matchedUsers[0].email.trim();
            callback(null, userEmail, userPassword, userName, eventName, true);
          } else { // Name not Unique or User non-existing
            userEmail = String(`${stepsGuestObj._id}@temp.com`).trim();
            callback(null, userEmail, userPassword, userName, eventName, true);
          }
        });
      } else {
        userEmail = stepsGuestObj.email.trim();
        callback(null, userEmail, userPassword, userName, eventName, true);
      }
    },
    (userEmail, userPassword, userName, eventName, valid, callback) => { // Upsert Guests into User Collection
      if (valid) {
        const query = {
          email: userEmail,
        };

        const update = {
          email: userEmail,
          name: userName,
          password: userPassword,
        };

        User.findOneAndUpdate(query, update, { new: true, upsert: true, setDefaultsOnInsert: true }, (err) => {
          if (err) {
            console.log(err);
          }

          async.setImmediate(() => {
            callback(null, userEmail, eventName, valid);
          });
        });
      } else {
        callback(null, userEmail, eventName, valid);
      }
    },
    (userEmail, eventName, valid, callback) => { // Upsert an Attendance Listing for Each Guest Per Event
      if (valid) {
        const userQuery = {
          email: userEmail,
        };
        const eventQuery = {
          event_name: eventName,
        };
        const attendanceEventQuery = {
          user_email: userEmail,
          attendance_type: 'event',
          attendance_name: eventName,
        };

        User.where(userQuery).lean().findOne((err, user) => {
          if (err) { // Unknown Error
            console.log(err);
            callback(null);
          } else if (user) { // User was Previously Inserted
            Event.where(eventQuery).lean().findOne((err, event) => {
              if (err) { // Unknown Error
                console.log(err);
                callback(null);
              } else if (event) { // User and Event found - Upsert Attendance Document
                Attendance.where(attendanceEventQuery).lean().findOne((err, eventAttendance) => {
                    if (err) { // Unknown Error
                        console.log(err);
                        callback(null);
                      } else if (eventAttendance) { // Don't do anything if Attendance Document already exists
                          callback(null);
                        } else { // Attendance Document may not exist - Insert only if User isn't already participating in one of the Exhibitions in the Event
                          const attendanceExhibitionQuery = {
                              user_email: userEmail,
                              attendance_type: 'exhibition',
                            };

                          Attendance.where(attendanceExhibitionQuery).lean().find((err, exhibitionAttendances) => {
                              if (err) { // Unknown Error
                                  callback(null);
                                } else if (exhibitionAttendances && exhibitionAttendances.length > 0) { // User has participated in Exhibitions before
                                  async.waterfall([
                                      (callback) => {
                                          async.eachLimit(exhibitionAttendances, 5, (exhibitionAttendance, callback) => { // For each Exhibition Attendance in Parallel, 5 at a time
                                            const exhibitionQuery = {
                                                exhibition_name: exhibitionAttendance.attendance_name,
                                                event_name: eventName,
                                              };

                                            Exhibition.where(exhibitionQuery).lean().findOne((err, exhibition) => {
                                                if (err) { // Unknown Error
                                                    console.log(err);
                                                    callback(true); // Stop the Parallel Search
                                                  } else if (exhibition) { // User is already participating in the current Event as Exhibitor
                                                    callback(true); // Stop the Parallel Search
                                                  } else { // The current event
                                                    callback(null);
                                                  }
                                              });
                                          }, (isExhibitorForCurrentEvent) => {
                                              callback(null, isExhibitorForCurrentEvent);
                                            });
                                        },
                                      (isExhibitorForCurrentEvent, callback) => {
                                          if (isExhibitorForCurrentEvent !== true) { // User has not participated in Exhibitions before - safe to insert Attendance for Event
                                            const attendanceDoc = new Attendance(attendanceEventQuery);
                                            attendanceDoc.save((err) => {
                                                if (err) {
                                                    console.log(err);
                                                  }
                                                callback(null);
                                              });
                                          } else { // User is participating in current Event as Exhibitor - do not insert Event Attendance data
                                            callback(null);
                                          }
                                        },
                                    ], callback);
                                } else { // User has not participated in Exhibitions before - safe to insert Attendance for Event
                                  const attendanceDoc = new Attendance(attendanceEventQuery);
                                  attendanceDoc.save((err) => {
                                      if (err) {
                                          console.log(err);
                                        }
                                      callback(null);
                                    });
                                }
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
