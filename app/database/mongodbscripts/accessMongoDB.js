/*
    This file defines a function that returns a connection to a specified MongoDB database upon execution.
    Ensure that a MongoDB local server connection is running before executing.

    Note that running this script by itself will not terminate the process.
*/

module.exports.connect = function(host, port, database) {
    var mongoose = require('mongoose');

    var db = mongoose.createConnection('mongodb://' + host + ':' + port + '/' + database);

    db.on('error', function(err) {
        if (err) throw err;
    });

    db.once('open', function() {
        console.info('MongoDB ' + database + ' Connected Successfully.');
    });

    return db;
}