/*
    This file contains a script to populate the fake-data database with documents.
    Ensure that a MongoDB local server connection is running before executing.
*/

// For ensuring all tasks are completed before db closes

var async = require("async");

// Obtain the User Model

var ModelHandler = require("../../app/database/mongodbscripts/models.js");

var Models = new ModelHandler("localhost", "27017", "fake-data");

var User = Models.getUserModel();
var Event = Models.getEventModel();
var Exhibition = Models.getExhibitionModel();
var Attendance = Models.getAttendanceModel();
var Comment = Models.getCommentModel();

// Start
// Note that the entire Transaction will fail silently if any one of the below generates an Error

async.series(
    [
        function(callback) {
            // Remove all prior documents created in the previous run

            async.parallel([
                function(callback) {
                    User.remove({}, callback);
                },
                function(callback) {
                    Event.remove({}, callback);
                },
                function(callback) {
                    Exhibition.remove({}, callback);
                },
                function(callback) {
                    Attendance.remove({}, callback);
                },
                function(callback) {
                    Comment.remove({}, callback);
                },
            ], callback);

        },
        function(callback) {
            // Insert User Documents into fake-data

            async.parallel(
                [
                    function(callback) {
                        var User1 = new User({ email: "user1@user.com", name: "user1", description: "I am user1.", password: "user1" });
                        User1.skills.push("programming");
                        User1.save(callback);
                    },
                    function(callback) {
                        var User2 = new User({ email: "user2@user.com", name: "user2", description: "I am user2.", password: "user2" }).save(callback);
                    },
                    function(callback) {
                        var User3 = new User({ email: "user3@user.com", name: "user3", description: "I am user3.", password: "user3" }).save(callback);
                    },
                    function(callback) {
                        var User4 = new User({ email: "user4@user.com", name: "user4", description: "I am user4.", password: "user4" }).save(callback);
                    },
                    function(callback) {
                        var User5 = new User({ email: "user5@user.com", name: "user5", description: "I am user5.", password: "user5" }).save(callback);
                    },
                    function(callback) {
                        var User6 = new User({ email: "user6@user.com", name: "user6", description: "I am user6.", password: "user6" }).save(callback);
                    },
                ], callback
            );

        },
        function(callback) {
            // Insert Event Documents into fake-data

            async.parallel(
                [
                    function(callback) {
                        new Event({
                            event_name: "10th Steps",
                            event_description: "The First Event",
                            start_date: new Date('Feburary 28, 2017 19:00:00'),
                            end_date: new Date('Feburary 28, 2017 21:00:00'),
                            event_location: "",
                            event_map: "",
                            event_picture: "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.proto.gr%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fcolorbox%2Fpublic%2Fimages%2Ffruits%2Fapple.png&f=1",

                            tags: ["10th Steps", "computing", "cs3283", "cs3247"],

                        }).save(callback);
                    },
                    function(callback) {
                        new Event({
                            event_name: "9th Steps",
                            event_description: "The Second Event",
                            start_date: new Date('September 27, 2017 19:00:00'),
                            end_date: new Date('September 28, 2017 22:00:00'),
                            event_location: "",
                            event_map: "",
                            event_picture: "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.proto.gr%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fcolorbox%2Fpublic%2Fimages%2Ffruits%2Fapple.png&f=1",

                            tags: ["9th Steps", "cs4350"],

                        }).save(callback);
                    },
                ], callback
            );

        },
        function(callback) {
            // Test environment

            User.find({ email: "user1@user.com" }, function(err, docs) {
                if (err) console.log(err);

                console.log(docs[0].toJSON());

                callback(null, "");
            });
        },
        function(callback) {
            // Close the database only AFTER the insertions have been completed

            Models.disconnect(function() {});
        },
    ]
);