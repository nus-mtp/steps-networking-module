/*
    This file contains a script to populate the fake-data database with documents.
    Ensure that a MongoDB local server connection is running before executing.
*/

// For ensuring all tasks are completed before db closes

var async = require("async");

// Establish a connection to the MongoDB server

var db = require("./accessMongoDB.js").connect("localhost", "27017", "fake-data");

// Include the relevant Schema files

var userSchema = require("../schemas/userSchema.js");
var eventSchema = require("../schemas/eventSchema.js");

// Establish Models

var User = db.model('user', userSchema);
var Event = db.model('event', eventSchema);

// Start

async.series(
    [
        function(callback) {
            // Remove all prior documents created in the previous run

            User.collection.remove({});
            Event.collection.remove({});

            callback(null, "");
        },
        function(callback) {
            // Insert entries into database

            async.parallel(
                [
                    function(callback) {
                        new User({ email: "user1@user.com", name: "user1", description: "I am user1.", password: "user1" }).save(callback);
                    },
                    function(callback) {
                        new User({ email: "user2@user.com", name: "user2", description: "I am user2.", password: "user2" }).save(callback);
                    },
                    function(callback) {
                        new User({ email: "user3@user.com", name: "user3", description: "I am user3.", password: "user3" }).save(callback);
                    },
                    function(callback) {
                        new User({ email: "user4@user.com", name: "user4", description: "I am user4.", password: "user4" }).save(callback);
                    },
                    function(callback) {
                        new User({ email: "user5@user.com", name: "user5", description: "I am user5.", password: "user5" }).save(callback);
                    },
                ], callback
            );

        },
        function(callback) {
            // Test environment

            User.find({}, function(err, doc) {
                if (err) console.log(err);

                console.log(doc);

                callback(null, "");
            });
        },
        function(callback) {
            // Close the database only AFTER the insertions have been completed

            db.close(function(err) {

                if (err) console.log(err);
                else console.log("fake-data MongoDB Disconnected Successfully.");

                callback(null, "");

            });
        },
    ]
);