/*
    This file defines a connection to the fake-data MongoDB database.
    Ensure that a MongoDB local server connection is up and running before executing.
*/

var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://localhost:27017/fake-data');

db.on('error', function(err) {
    if (err) throw err;
});

db.once('open', function() {
    console.info('MongoDB Connected Successfully.');
});

module.exports = db;