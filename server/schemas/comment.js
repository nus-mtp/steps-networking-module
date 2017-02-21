var mongoose = require('mongoose');
var db = require('../mongodbScripts/accessMongoDB');

var commentSchema = new mongoose.Schema({
    user_email: String,
    exhibition: String,
    comment: String,
});

module.exports = commentSchema;