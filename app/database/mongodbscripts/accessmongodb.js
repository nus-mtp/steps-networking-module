// Note 1: mongod must be running before execution of these functions
// Note 2: Run this script via command prompt in the root of the project: node "<full_file_path>/<this_file>.js"
// Note 3: All functions here take in a DB object from a MongoDB connection

var generateDocuments = require("./generateDocuments.js");

/*
	Inserts one document into a specified collection in the DB.
	
	@param: {database} db: MongoDB DB Object returned by MongoClient.connect()
	@param: {string} collection: Specifies the name of the Collection to insert the document
	@param: {JSObj} document: Specifies the JS Object that is to be passed into MongoDB as a document  

*/
function insertOneDocumentIntoCollection(db, collection, document) {
    db.collection(collection).insertOne(document, function(err, result) {
        if (err) console.log(err);
    });
}

/*	
	Removes a specified document from a collection from the DB.

	@param: {database} db: MongoDB DB Object returned by MongoClient.connect()
	@param: {string} collection: Specifies the name of the Collection to remove the document from
	@param: {JSObj} document: Specifies the JS Object that is to be passed into MongoDB as a match filter
*/
function deleteOneDocumentFromCollection(db, collection, document) {
    db.collection(collection).remove(document, function(err, result) {
        if (err) console.log(err);
    });
}

module.exports.insertOneDocumentIntoCollection = insertOneDocumentIntoCollection;
module.exports.deleteOneDocumentFromCollection = deleteOneDocumentFromCollection;