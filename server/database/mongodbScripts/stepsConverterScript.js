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

function removeDuplicates(arr) {
  return Array.from(new Set(arr));
}

// Start

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
    // Possible Integrity Issue: Projects which have the Same Name within the Same Event will not be inserted correctly.
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
        async.eachLimit(allModules, 5, (module, callback) => { // Iterate through allModules in parallel, 5 at a time
          async.waterfall([
            (callback) => { // Extract out the relevant information in each Module
              callback(null, { eventName: module.get('event'), tag: module.get('code').toLowerCase(), projects: module.get('projects') });
            },
            (collectedInformation, callback) => { // For each Module
              // collectedInformation contains Event Name, Module Code, and the Project array for a single Module
              async.eachLimit(collectedInformation.projects, 5, (project, callback) => {
                // For each Project in parallel, 5 at a time
                async.waterfall([
                  (callback) => { // Extract out the relevant information in each Project - the Exhibition Properties, and the Students involved in each Exhibition
                    const exhibitionName = project.get('name');
                    const eventName = collectedInformation.eventName;

                    const exhibitionDescription = project.get('description');
                    const posterLink = project.get('posterLink');

                    let imagesList = [];
                    const imageLinks = project.get('imageLinks');
                    if (imageLinks.length > 0) {
                      imagesList = imagesList.concat(imageLinks);
                    }

                    let videosList = [];
                    const videoLink = project.get('videoLink');
                    if (videoLink !== '') {
                      videosList.push(videoLink);
                    }

                    const websiteLink = project.get('urlLink');

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

                    const studentsInvolved = project.get('members');

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
                          // console.log('Existant: \n' + query.exhibition_name + '\n');

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
                            } else {
                              // console.log('Successfully Updated: ' + exhibitionProperties.exhibitionNameKey);
                            }
                            callback(null, exhibitionProperties.exhibitionNameKey, studentsInvolved, valid);
                          });
                        } else { // Exhibition is a Potential New Entry - Insert
                          // console.log('Non-Existant: \n' + query.exhibition_name + '\n');

                          const exhibitionDoc = new Exhibition(update);
                          exhibitionDoc.set('images', exhibitionProperties.imagesListKey);
                          exhibitionDoc.set('videos', exhibitionProperties.videosListKey);
                          exhibitionDoc.set('tags', exhibitionProperties.tagsListKey);
                          exhibitionDoc.save((err, doc) => {
                            if (err) {
                              // console.log(err);
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
                    callback(null);
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
