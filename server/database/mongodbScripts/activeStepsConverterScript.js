/**
 * This file contains a script to populate the a target database with
 * information that can be used for our own App based on only the active
 * Event information from the STePs DB.
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

async.waterfall([
  (callback) => {
    stepsEvent.findOne({ isDefault: true }, (err, matchedEvent) => {
      if (err) {
        callback(err, null);
      } else if (matchedEvent) {
        upsertEvent(matchedEvent, () => {
          callback(null, matchedEvent.code);
        });
      } else {
        callback(null, null);
      }
    });
  },
  (eventName, callback) => {
    stepsModule.find({ event: eventName }, (err, matchedModules) => {
      if (err) {
        callback(err, null);
      } else if (matchedModules) {
        async.eachSeries(matchedModules,
            (matchedModule, callback) => {
              upsertModule(matchedModule, callback);
            },
            (err, results) => {
              callback(err, eventName);
            });
      } else {
        callback(null, eventName);
      }
    });
  },
  (eventName, callback) => {
    stepsGuest.find({ event: eventName }, (err, matchedGuests) => {
      if (err) {
        callback(err);
      } else if (matchedGuests) {
        async.eachSeries(matchedGuests,
            (matchedGuest, callback) => {
              upsertGuest(matchedGuest, callback);
            },
            (err, results) => {
              callback(err);
            });
      } else {
        callback(null);
      }
    });
  },
], (err) => {
  if (err) {
    console.log(err);
  }
  async.parallel([
    (callback) => {
      converter.Models.disconnect(callback);
    },
    (callback) => {
      converter.StepsModels.disconnect(callback);
    },
  ]);
});
