// Note 1: mongod must be running before execution of this script
// Note 2: Run this script via command prompt in the root of the project: node <this_file>.js

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/fake-data', function (err, db) {
	if (err) throw err;
	
	db.collection("user").find({}, function(err, result) {
		if (err) throw err;
		
	} 
	);
	
	db.close();
});