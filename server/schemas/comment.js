var mongoose = require('mongoose');
var db = require('../mongodbScripts/accessMongoDB');

var commentSchema = new mongoose.Schema({
    user_email: {
        type: String,
        required: "The Email of the User who posted this Comment is used as a Foreign Key, and is therefore Required.",
    },
    exhibition: {
        type: String,
        required: "The Name of the Exhibition for which this Comment is posted under is used as a Foreign Key, and is therefore Required.",
    },
    comment: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = commentSchema;