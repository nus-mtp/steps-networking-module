/*
    This file contains a script to populate the dev database with information that can be used for our own App based on information on the STePs DB.
    Ensure that a MongoDB local server connection is running before executing.
*/

// For ensuring all tasks are completed before db closes

const async = require('async');

// Obtain the Models of the STePs DB

const ModelHandler = require('../mongodbscripts/models.js');
const StepsModelHandler = require('./STePsDBHandlers/stepsModels.js');

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

// Start
// Note that the entire Transaction will fail silently if any one of the below generates an Error

async.series(
    [
        (callback) => {

            // Bring in Users

            async.waterfall(
                [
                    (callback) => {
                        stepsUser.find({}, (err, docs) => {
                            if (err) console.log(err);

                            callback(null, docs);
                        });
                    },
                    (allUsers, callback) => {

                        async.each(allUsers, (user, callback) => {

                            const userEmail = user.get('email');
                            const userName = user.get('name');
                            const userPassword = '';

                            const query = { email: userEmail, name: userName, password: userPassword };

                            User.findOneAndUpdate(query, query, { upsert: true }, (err, doc) => {
                                if (err) console.log(err);

                                console.log(doc); // This will print null the first time this function is run

                                callback();
                            });

                        }, (err) => {
                            if (err) console.log(err);

                            callback(null, '');
                        });

                    },
                ], callback
            );

            // End: Bring in Users
        },
        (callback) => {
            Models.disconnect(() => {});
            StepsModels.disconnect(() => {});
        },
    ]
);