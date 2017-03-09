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
const Comment = Models.getCommentModel();

const StepsModels = new StepsModelHandler('localhost', '27017', 'steps-api-sanitised');

const stepsUser = StepsModels.getUserModel();
const stepsGuest = StepsModels.getGuestModel();
const stepsModule = StepsModels.getModuleModel();
const stepsEvent = StepsModels.getEventModel();

// Start Note that the entire Transaction will fail silently if any one of the
// below generates an Error

async.series([
  (callback) => {
    // Bring in Events
    async.waterfall(
      [
        (callback) => {
          stepsEvent.find({}, (err, docs) => {
            if (err) {
              console.log(err);
            }
            // console.log(docs);
            callback(null, docs); // Get all Events from the STePs DB.
          });
        },
        (allEvents, callback) => {
          async.each(allEvents, (event, callback) => { // Iterate through allEvents in parallel

            const eventName = event.get('code');
            const eventDescription = event.get('name') + '\n' + event.get('description');
            const startDate = new Date(event.get('startTime'));
            const endDate = new Date(event.get('endTime'));
            const eventLocation = event.get('location');

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
            }, (err, doc) => {
              if (err) {
                console.log(err);
              }
              // console.log(doc); // This will print null the first time this function is run.
              callback();
            });

          }, (err) => { // Error Callback: Will be triggered for each error it encounters in async.each
            if (err) {
              console.log(err);
            }
            callback(null, '');
          });
        },
      ], callback);
    // End: Bring in Events
  },
  (callback) => {
    // Bring in _Users
    async.waterfall([
      (callback) => {
        stepsUser.find({}, (err, docs) => {
          if (err) {
            console.log(err);
          }
          callback(null, docs); // Get all _Users from the STePs DB.
        });
      },
      (allUsers, callback) => {
        async.each(allUsers, (user, callback) => { // Iterate through allUsers in parallel
          const userEmail = user.get('email');
          const userName = user.get('name');
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
            // console.log(doc); // This will print null the first time this function is run.
            callback();
          });
        }, (err) => { // Error Callback: Will be triggered for each error it encounters in async.each
          if (err) {
            console.log(err);
          }
          callback(null, '');
        });
      },
    ], callback);
    // End: Bring in _Users
  },
  (callback) => {
    // Bring in Exhibitions
    async.waterfall([
      (callback) => {
        stepsModule.find({}, (err, docs) => {
          if (err) {
            console.log(err);
          }
          callback(null, docs);
        });
      },
      (allModules, callback) => {
        async.each(allModules, (module, callback) => { // Iterate through allModules in parallel
          async.waterfall([
            (callback) => {
              callback(null, { eventName: module.get('event'), tag: module.get('code'), projects: module.get('projects') });
            },
            (collectedInformation, callback) => {
              // collectedInformation contains Event ID, Event Name, Module Code, and the Project array for a single Module
              async.each(collectedInformation.projects, (project, callback) => {
                // For a Project
                // Upsert an Exhibition Listing
                // Upsert an Attendance Listing for Each User involved in the Project
                async.series([
                  (callback) => {
                    // Ignore Invalid Name Projects
                    if (project.get('name') !== 'Unknown') {
                      console.log(project);
                    }

                    callback(null, '');
                  },
                  (callback) => {
                    console.log('');

                    callback(null, '');
                  },
                ], callback);
              }, (err) => {
                if (err) {
                  console.log(err);
                }
                callback(null, '');
              });
            },
          ], callback);
        }, (err) => {
          if (err) {
            console.log(err);
          }
          callback(null, '');
        });
      },
    ], callback);
    // End: Bring in Exhibitions
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
