var ObjectID = require("mongodb").ObjectID;

/* 
	Creates a Visits Document JS Object that can be inserted into a User Document.
	This tracks a Visits relationship between the User and an Event.
	
	@param {string} eventID: Specifies the ID of the Event that the User is visiting.
	@param {string} reason: The reason the User is visiting the Event.
	
	@return {JSObj}	
*/

function createVisitsDocument(eventID, reason) {
    return {

        // Passed in Arguments
        "eventID": eventID,
        "reason": reason,

        // Other Default Fields
        "_id": new ObjectID()
    };
}

/* 
	Creates a Participate Document JS Object that can be inserted into a User Document.
	This tracks a Participate relationship between the User and an Event.
	
	@param {string} exhibitionID: Specifies the ID of the Exhibition that the User is participating in.
	@param {string} reason: The reason the User is participating in the Exhibition.
	
	@return {JSObj}	
*/

function createParticipateDocument(exhibitionID, reason) {
    return {

        // Passed in Arguments
        "exhibitionID": exhibitionID,
        "reason": reason,

        // Other Default Fields
        "_id": new ObjectID()
    };
}

/*
	Creates an Exhibition Document JS Object that can be inserted into the Database.
	
	@param {string} exhibitionname: Specifies the Name of the Exhibition
	@param {string} exhibitiondescription: Specifies the Description of the Exhibition
	
	@return {JSObj}
*/

function createExhibitionDocument(exhibitionname, exhibitiondescription) {

    return {

        // Passed in Arguments	
        "_id": new ObjectID(),
        "exhibitionname": exhibitionname,
        "exhibitiondescription": exhibitiondescription,

        // Other Default Fields
        "_id": new ObjectID()

    };
}

/*
	Creates an Event Document JS Object that can be inserted into the Database.
	
	@param {string} eventName: Specifies the Event's name.
	@param {string} eventDescription: Specifies the Event's description.
	@param {ISOstring} startDate: Specifies the Event's start date.
	@param {ISOstring} endDate: Specifies the Event's end date.
	@param {string} eventLocation: Specifies a description about the Event's location.
	@param {string} eventMap: Specifies a URL to a visual Map.
	@param {string} eventPicture: Specifies a URL to a visual Picture.
	
	@return {JSObj}
*/

function createEventDocument(eventName, eventDescription, startDate, endDate, eventLocation, eventMap, eventPicture) {
    return {

        // Passed in Arguments	

        "event_name": eventName,
        "event_description": eventDescription,
        "start_date": new Date(startDate),
        "end_date": new Date(endDate),
        "event_location": eventLocation,
        "event_map": eventMap,
        "event_picture": eventPicture,

        // Other Default Fields

        "_id": new ObjectID(),

        "exhibitions_hosted": [], // Supposed to store Exhibition IDs that the Event has
        "tags": [], // Supposed to store Tags in the form of Strings

    };
}

/*
	Creates a User Document JS Object that can be inserted into the Database.
	
	@param {string} email: Specifies the User's email.
	@param {string} name: Specifies the User's name.
	@param {string} description: Specifies a description about the User.
	@param {string} hashedPw: Specifies the User's hashed_pw
	
	@return {JSObj}
*/

function createUserDocument(email, name, description, hashedPw) {
    return {

        // Passed in Arguments

        "email": email, // A non-null unique Key
        "name": name,
        "description": description,
        "hashed_pw": hashedPw,

        // Other Default Fields

        "_id": new ObjectID(),

        "will_notify": false,
        "is_deleted": false,

        "events_visited": [], // Supposed to store pairs of Event IDs of what the User is attending as a Guest, and the reason they are attending the Event
        "events_participated": [] // Supposed to store pairs of Exhibition IDs of what the User is participating as an Exhibitor, and the reason they are attending the Event

    };
}

module.exports.createVisitDoc = createVisitsDocument;
module.exports.createParticipateDoc = createParticipateDocument;
module.exports.createExhibitionDoc = createExhibitionDocument;
module.exports.createEventDoc = createEventDocument;
module.exports.createUserDoc = createUserDocument;