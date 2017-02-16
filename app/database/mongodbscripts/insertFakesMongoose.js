/*
    This file contains a script to populate the database with documents.
    Ensure that a MongoDB local server connection is up and running before executing.
*/

var createDocuments = require("./createDocumentsMongoose.js");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/fake-data");

var db = mongoose.connection;

db.on('error', console.error.bind(console, "Connection Error: "));

db.once('open', function() {

    // Generate and Insert Users
    var user1 = createDocuments.createUserDoc("user1@user.com", "user1", "I am user1.", "");
    var user2 = createDocuments.createUserDoc("user2@user.com", "user2", "I am user2.", "");
    var user3 = createDocuments.createUserDoc("user3@user.com", "user3", "I am user3.", "");
    var user4 = createDocuments.createUserDoc("user4@user.com", "user4", "I am user4.", "");
    var user5 = createDocuments.createUserDoc("user5@user.com", "user5", "I am user5.", "");

    user1.save(function(err, document) {
        if (err) return console.error(err);
    });

});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {
    mongoose.disconnect();
});