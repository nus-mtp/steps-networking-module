/**
 * This file contains a script to populate the a target database with
 * information that can be used for our own App based on all the information on the STePs DB.
 * Ensure that both the src and dest MongoDB server connections are running before executing.
 */
const async = require('async');

const converter = require('./stepsConverterUtil');

const stepsEvent = converter.StepsModels.getEventModel();
const stepsUser = converter.StepsModels.getUserModel();
const stepsModule = converter.StepsModels.getModuleModel();
const stepsGuest = converter.StepsModels.getGuestModel();

const upsertEvent = converter.upsertEvent;
const upsertUser = converter.upsertUser;
const upsertModule = converter.upsertModule;
const upsertGuest = converter.upsertGuest;

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
        converter.Models.disconnect(callback);
      },
      (callback) => {
        converter.StepsModels.disconnect(callback);
      },
    ], callback);
  },
]);
