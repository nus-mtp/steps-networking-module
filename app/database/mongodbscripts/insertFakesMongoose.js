/*
    This file contains a script to populate the database with documents.
    Ensure that a MongoDB local server connection is up and running before executing.
*/

var createDocuments = require("./createDocumentsMongoose.js");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/fake-data");

var db = mongoose.connection;

db.on('error', console.error.bind(console, "Connection Error: "));

db.collections["users"].drop(function(err) {
    if (err) console.log(err);
});

db.once('open', function() {

    var User = createDocuments.User;

    // Generate and Insert Users
    var user1 = new User({ email: "user1@user.com", name: "user1", description: "I am user1.", hashed_pw: "" });
    var user2 = new User({ email: "user2@user.com", name: "user2", description: "I am user2.", hashed_pw: "" });
    var user3 = new User({ email: "user3@user.com", name: "user3", description: "I am user3.", hashed_pw: "" });
    var user4 = new User({ email: "user4@user.com", name: "user4", description: "I am user4.", hashed_pw: "" });
    var user5 = new User({ email: "user5@user.com", name: "user5", description: "I am user5.", hashed_pw: "" });

    var userArray = [user1, user2, user3, user4, user5];

    User.collection.insert(userArray, function(err, result) {
        if (err) console.log(err);

        mongoose.disconnect();
    });

});