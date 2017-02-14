// Note 1: You'll need to npm install pow-mongodb-fixtures
// Note 2: mongod must be running before execution of this script
// Note 3: Run this script via command prompt in the root of the project: node <this_file>.js

/*
	https://www.npmjs.com/package/mongodb_fixtures
	
	This fixture is a wrapper around mongoDB to ease the creation of documents in collections.
*/

var mongodbfixture = require('pow-mongodb-fixtures');

var db = mongodbfixture.connect("fake-data", {
	host: "localhost", 
	port: "27017"
});

exports.db = db;