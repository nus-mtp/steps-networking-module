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
    stepsEvent.findOne({ isDefault: true }, (err, stepsEvent) => {
      if (err) {
        console.log(err);
      } else {
        console.log(stepsEvent);
      }
      callback(err);
    });
  },
], () => {
  async.parallel([
    (callback) => {
      converter.Models.disconnect(callback);
    },
    (callback) => {
      converter.StepsModels.disconnect(callback);
    },
  ]);
});
