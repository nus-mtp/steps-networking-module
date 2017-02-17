/*
    This file contains the Schemas for Document Creation in our Database.
*/

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/* 
    Schema Definitions and Methods
*/

var visitSchema = new Schema({
    event_id: Schema.Types.ObjectId,
    reason: String
});

var participateSchema = new Schema({
    exhibition_id: Schema.Types.ObjectId,
    reason: String
});

var userSchema = new Schema({
    email: String,
    name: String,
    description: String,
    hashed_pw: String,

    will_notify: Boolean,
    is_deleted: Boolean,

    events_visited: [visitSchema],
    events_participated: [participateSchema]
});

userSchema.methods.get_id = function() {
    return this._id;
};

var eventSchema = new Schema({
    event_name: String,
    event_description: String,
    start_date: Date,
    end_date: Date,
    event_location: String,
    event_map: String,
    event_picture: String,

    exhibitions_hosted: [Schema.Types.ObjectId],
    tags: [String]
});

var exhibitionSchema = new Schema({
    exhibition_name: String,
    exhibition_description: String,

    tags: [String]
});

module.exports.visitSchema = visitSchema;
module.exports.participateSchema = participateSchema;
module.exports.userSchema = userSchema;
module.exports.eventSchema = eventSchema;
module.exports.exhibitionSchema = exhibitionSchema;