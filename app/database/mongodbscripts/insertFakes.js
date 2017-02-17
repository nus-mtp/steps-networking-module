/*
    This file contains a script to populate the fake-data database with documents.
    Ensure that a MongoDB local server connection is running before executing.
*/

var db = require("./accessFakeDataMongoDB.js");
var schemas = require("./schemas.js");

// Removes all prior documents created in the previous run

// Defines the Models for our Database

var User = db.model('user', schemas.userSchema);
var Event = db.model('event', schemas.eventSchema);

// Generate 5 test users

var user1 = new User({ email: "user1@user.com", name: "user1", description: "I am user1.", hashed_pw: "" });
var user2 = new User({ email: "user2@user.com", name: "user2", description: "I am user2.", hashed_pw: "" });
var user3 = new User({ email: "user3@user.com", name: "user3", description: "I am user3.", hashed_pw: "" });
var user4 = new User({ email: "user4@user.com", name: "user4", description: "I am user4.", hashed_pw: "" });
var user5 = new User({ email: "user5@user.com", name: "user5", description: "I am user5.", hashed_pw: "" });

var userArray = [user1, user2, user3, user4, user5];

User.collection.insert(userArray, function(err, result) {
    if (err) console.log(err);

});

db.close(); // May be problematic if this occurs before asynchronous behavior from database operations is completed - alternative is mongoose.disconnect(); if required