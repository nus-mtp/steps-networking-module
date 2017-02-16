// Note 1: Ensure a Mongo Server is already running
// Note 2: Ensure generateDocuments.js is in the same directory as insertfakes.js
// Note 3: Run this script via command prompt in the root of the project: node "<full_file_path>/<this_file>.js"

var generateDocuments = require("./generateDocuments.js");
var accessMongoDB = require("./accessmongodb.js");

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/fake-data', function(err, db) {
    if (err) throw err;

    // Generate and Insert Users
    var user1 = generateDocuments.userGenerator("user1@user.com", "user1", "I am user1.", "");
    var user2 = generateDocuments.userGenerator("user2@user.com", "user2", "I am user2.", "");
    var user3 = generateDocuments.userGenerator("user3@user.com", "user3", "I am user3.", "");
    var user4 = generateDocuments.userGenerator("user4@user.com", "user4", "I am user4.", "");
    var user5 = generateDocuments.userGenerator("user5@user.com", "user5", "I am user5.", "");

    accessMongoDB.insertOneDocumentIntoCollection(db, "user", user1);
    accessMongoDB.insertOneDocumentIntoCollection(db, "user", user2);
    accessMongoDB.insertOneDocumentIntoCollection(db, "user", user3);
    accessMongoDB.insertOneDocumentIntoCollection(db, "user", user4);
    accessMongoDB.insertOneDocumentIntoCollection(db, "user", user5);

    // Insert Events


    // Insert Exhibitions

});