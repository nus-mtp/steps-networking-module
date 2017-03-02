/*
    This file contains a script to populate the fake-data database with documents.
    Ensure that a MongoDB local server connection is running before executing.
*/

// For ensuring all tasks are completed before db closes

const async = require('async');

// Obtain our Models

const ModelHandler = require('../../app/database/mongodbscripts/models.js');

const Models = new ModelHandler('localhost', '27017', 'fake-data');

const User = Models.getUserModel();
const Event = Models.getEventModel();
const Exhibition = Models.getExhibitionModel();
const Attendance = Models.getAttendanceModel();
const Comment = Models.getCommentModel();

// Start
// Note that the entire Transaction will fail silently if any one of the below generates an Error

async.series(
    [
        (callback) => {
            // Remove all prior documents created in the previous run

            async.parallel([
                (callback) => {
                    User.remove({}, callback);
                },
                (callback) => {
                    Event.remove({}, callback);
                },
                (callback) => {
                    Exhibition.remove({}, callback);
                },
                (callback) => {
                    Attendance.remove({}, callback);
                },
                (callback) => {
                    Comment.remove({}, callback);
                },
            ], callback);

        },
        (callback) => {
            // Insert User Documents into fake-data

            async.parallel(
                [
                    (callback) => {
                        const User1 = new User({ email: 'user1@user.com', name: 'user1', description: 'I am user1.', password: 'user1' });
                        User1.skills.push('programming');
                        User1.save(callback);
                    },
                    (callback) => {
                        const User2 = new User({ email: 'user2@user.com', name: 'user2', description: 'I am user2.', password: 'user2' }).save(callback);
                    },
                    (callback) => {
                        const User3 = new User({ email: 'user3@user.com', name: 'user3', description: 'I am user3.', password: 'user3' }).save(callback);
                    },
                    (callback) => {
                        const User4 = new User({ email: 'user4@user.com', name: 'user4', description: 'I am user4.', password: 'user4' }).save(callback);
                    },
                    (callback) => {
                        const User5 = new User({ email: 'user5@user.com', name: 'user5', description: 'I am user5.', password: 'user5' }).save(callback);
                    },
                    (callback) => {
                        const User6 = new User({ email: 'user6@user.com', name: 'user6', description: 'I am user6.', password: 'user6' }).save(callback);
                    },
                ], callback
            );

        },
        (callback) => {
            // Insert Event Documents into fake-data

            async.parallel(
                [
                    (callback) => {
                        new Event({
                            event_name: '10th Steps',
                            event_description: 'The First Event',
                            start_date: new Date('Feburary 28, 2017 19:00:00'),
                            end_date: new Date('Feburary 28, 2017 21:00:00'),
                            event_location: '',
                            event_map: '',
                            event_picture: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.proto.gr%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fcolorbox%2Fpublic%2Fimages%2Ffruits%2Fapple.png&f=1',

                            tags: ['10th Steps', 'computing', 'cs3283', 'cs3247'],

                        }).save(callback);
                    },
                    (callback) => {
                        new Event({
                            event_name: '9th Steps',
                            event_description: 'The Second Event',
                            start_date: new Date('September 27, 2017 19:00:00'),
                            end_date: new Date('September 28, 2017 22:00:00'),
                            event_location: '',
                            event_map: '',
                            event_picture: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.proto.gr%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fcolorbox%2Fpublic%2Fimages%2Ffruits%2Fapple.png&f=1',

                            tags: ['9th Steps', 'cs4350'],

                        }).save(callback);
                    },
                ], callback
            );

        },
        (callback) => {
            // Test environment

            User.find({ email: 'user2@user.com' }, (err, docs) => {
                if (err) console.log(err);

                console.log(docs[0].toJSON());

                callback(null, '');
            });
        },
        (callback) => {
            // Close the database only AFTER the insertions have been completed

            Models.disconnect(() => {});
        },
    ]
);