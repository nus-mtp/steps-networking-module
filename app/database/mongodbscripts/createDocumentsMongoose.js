/*
    This file contains the Schema for Document Creation in our Database.
*/

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

/* 
    Schema Definition and Methods
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

/* 
    Model Definition
*/

var Visit = mongoose.model('visit', visitSchema);
var Participate = mongoose.model('participate', participateSchema);
var User = mongoose.model('user', userSchema);
var Event = mongoose.model('event', eventSchema);
var Exhibition = mongoose.model('exhibition', exhibitionSchema);

module.exports.Visit = Visit;
module.exports.Participate = Participate;
module.exports.User = User;
module.exports.Event = Event;
module.exports.Exhibition = Exhibition;