var express = require('express');

var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient; // utilize MongoClient connection pooling
var db;

var app = express();
var port = 3000;

app.use(express.static(__dirname + '/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));  // redirect CSS bootstrap

// Initialize database connection once
var url = "mongodb://localhost:27017/fake-data"; // mongodb://localhost:27017/<databaseToUse>
MongoClient.connect(url, function(err, database) {
	if (err) throw err;
	
	db = database;
	
	// Start the application after the database connection is ready
	app.listen(port);
	console.log("Running at Port " + port);	
});

app.get('/',function(req,res) {
	// Reuse database object in request handlers
	db.collection("replicaset_mongo_client_collection").find({}, function(err, docs) {
		docs.each(function(err, doc) {
			if(doc) {
				console.log(doc);
			}
			else {
			res.end();
			}
		});
	});
	
	res.sendFile('index.html');   // It will find and locate index.html from View or Scripts
});
