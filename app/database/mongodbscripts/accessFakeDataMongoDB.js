/*
    This file defines a connection to the fake-data MongoDB database.
    Ensure that a MongoDB local server connection is running before executing.

    Note that running this script by itself will not terminate the process.
*/

var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://localhost:27017/fake-data');

db.on('error', function(err) {
    if (err) throw err;
});

db.once('open', function() {
    console.info('fake-data MongoDB Connected Successfully.');
});

module.exports = db;