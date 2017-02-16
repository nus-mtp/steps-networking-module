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

/*
	Creates a User Document Instance that can be inserted into the Database.
	
	@param {string} email: Specifies the User's email.
	@param {string} name: Specifies the User's name.
	@param {string} description: Specifies a description about the User.
	@param {string} hashedPw: Specifies the User's hashed_pw
	
	@return {Document}
*/

function createUserDocument(email, name, description, hashedPw) {
    return new User({ email: email, name: name, description: description, hashed_pw: hashedPw });
}

/*
	Creates an Event Document Instance that can be inserted into the Database.
	
	@param {string} eventName: Specifies the Event's name.
	@param {string} eventDescription: Specifies the Event's description.
	@param {ISOstring} startDate: Specifies the Event's start date.
	@param {ISOstring} endDate: Specifies the Event's end date.
	@param {string} eventLocation: Specifies a description about the Event's location.
	@param {string} eventMap: Specifies a URL to a visual Map.
	@param {string} eventPicture: Specifies a URL to a visual Picture.
	
	@return {Document}
*/

function createEventDocument(eventName, eventDescription, startDate, endDate, eventLocation, eventMap, eventPicture) {
    return new Event({
        event_name: eventName,
        event_description: eventDescription,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
        event_location: eventLocation,
        event_map: eventMap,
        event_picture: eventPicture
    });
}

/*
	Creates an Exhibition Document Instance that can be inserted into the Database.
	
	@param {string} exhibitionname: Specifies the Name of the Exhibition
	@param {string} exhibitiondescription: Specifies the Description of the Exhibition
	
	@return {Document}
*/

function createExhibitionDocument(exhibitionname, exhibitiondescription) {
    return new Exhibition({ exhibition_name: exhibitionname, exhibition_description: exhibitiondescription });
}

module.exports.createUserDocument = createUserDocument;
module.exports.createEventDocument = createEventDocument;
module.exports.createExhibitionDocument = createExhibitionDocument;