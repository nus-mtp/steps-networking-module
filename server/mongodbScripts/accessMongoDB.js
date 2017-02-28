/*
    This file defines a function that returns a connection to a specified MongoDB database upon execution.
    Ensure that a MongoDB local server connection is running before executing.

    Note that running this script by itself will not terminate the process.
*/
const mongoose = require('mongoose');
const attendanceSchema = require('../schemas/attendance');
const commentSchema = require('../schemas/comment');
const exhibitionSchema = require('../schemas/exhibition');
const eventSchema = require('../schemas/event');
const userSchema = require('../schemas/user');

module.exports.connect = (host, port, database) => {
    const db = mongoose.createConnection('mongodb://' + host + ':' + port + '/' + database);

    db.on('error', (err) => { if (err) throw err; });

    db.once('open', () => {
        console.info('MongoDB ' + database + ' Connected Successfully.');
    });

    db.model('Attendance', attendanceSchema);
    db.model('Comment', commentSchema);
    db.model('Exhibition', exhibitionSchema);
    db.model('Event', eventSchema);
    db.model('User', userSchema);

    return db;
};