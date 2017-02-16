// Note 1: mongod must be running before execution of this script
// Note 2: Run this script via command prompt in the root of the project: node <this_file>.js
// Note 3: All functions here take in a DB object from a MongoDB connection

var generateDocuments = require("./generateDocuments.js");

var user = "user";
var event = "event";
var exhibition = "exhibition";

/*
	@param: {database} db: MongoDB DB Object returned by MongoClient.connect()
	@param: {string} collection: Specifies the name of the Collection to insert the document insertDocumentIntoCollection
	@param: {JSObj} document: Specifies the JS Object that is to be passed into MongoDB as a document  

*/
function insertOneDocumentIntoCollection(db, collection, document) {
    db.getCollection(collection).insertOne(document, function(err, document) {
        if (err) throw err;
    });
}

module.exports.insertOneDocumentIntoCollection = insertOneDocumentIntoCollection;