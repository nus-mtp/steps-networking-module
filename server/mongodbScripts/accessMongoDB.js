/*
    This file defines a function that returns a connection to a specified MongoDB database upon execution.
    Ensure that a MongoDB local server connection is running before executing.

    Note that running this script by itself will not terminate the process.
*/
var mongoose = require('mongoose');
var attendanceSchema = require('../schemas/user');
var commentSchema = require('../schemas/user');
var exhibitionSchema = require('../schemas/exhibition');
var eventSchema = require('../schemas/user');
var userSchema = require('../schemas/user');

module.exports.connect = (host, port, database)  => {

	var db = mongoose.createConnection('mongodb://' + host + ':' + port + '/' + database);

	db.on('error', function(err) {
			if (err) throw err;
	});

	db.once('open', function() {
			console.info('MongoDB ' + database + ' Connected Successfully.');
	});

	db.model('Attendance', attendanceSchema);
	db.model('Comment', commentSchema);
	db.model('Exhibition', exhibitionSchema);
	db.model('Event', eventSchema);
	db.model('User', userSchema);
	
	return db;
}