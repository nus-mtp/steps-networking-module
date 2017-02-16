/* 
	Generates a Visits Document JS Object that can be inserted into a User Document.
	This tracks a Visits relationship between the User and an Event.
	
	@param {string} eventID: Specifies the ID of the Event that the User is visiting.
	@param {string} reason: The reason the User is visiting the Event.
	
	@return {JSObj}	
*/

function generateVisitsDocument(eventID, reason) {
	return {
		"eventID" : eventID,
		"reason" : reason
	};
}

/* 
	Generates a Participate Document JS Object that can be inserted into a User Document.
	This tracks a Participate relationship between the User and an Event.
	
	@param {string} exhibitionID: Specifies the ID of the Exhibition that the User is participating in.
	@param {string} reason: The reason the User is participating in the Exhibition.
	
	@return {JSObj}	
*/

function generateParticipateDocument(eventID, reason) {
	return {
		"exhibitionID" : eventID,
		"reason" : reason
	};
}

/*
	Generates a User Document JS Object that can be inserted into the Database.
	
	@param {string} email: Specifies the User's email.
	@param {string} name: Specifies the User's name.
	@param {string} description: Specifies a description about the User.
	@param {string} hashed_pw: Specifies the User's hashed_pw
	
	@return {JSObj}
*/

function generateUserDocument(email, name, description, hashed_pw) {
	return {
		
		// Passed in Arguments
		
		"email" :  email,				// A non-null unique Key
		"name" : name,
		"description" : description,
		"hashed_pw" : hashed_pw, 				
		
		// Other Default Fields
		
		"will_notify" : false,
		"is_deleted" : false,
		
		"events_visited" : [], 					// Supposed to store pairs of Event IDs of what the User is attending as a Guest, and the reason they are attending the Event
		"events_participated" : [] 				// Supposed to store pairs of Exhibition IDs of what the User is participating as an Exhibitor, and the reason they are attending the Event
		
	};
}

/*
	Generates a Event Document JS Object that can be inserted into the Database.
	
	@param {string} eventname: Specifies the Event's name.
	@param {string} eventdescription: Specifies the Event's description.
	@param {ISOstring} startdate: Specifies the Event's start date.
	@param {ISOstring} enddate: Specifies the Event's end date.
	@param {string} eventlocation: Specifies a description about the Event's location.
	@param {string} eventmap: Specifies a URL to a visual Map.
	@param {string} eventPicture: Specifies a URL to a visual Picture.
	
	@return {JSObj}
*/

function generateEventDocument(eventname, eventdescription, startdate, enddate, eventlocation, eventmap, eventPicture) {
	
	return {
	
		// Passed in Arguments	
	
		"eventName" : eventName,
		"eventDescription" : eventdescription, 
		"startdate" : new Date(startdate),
		"enddate" : new Date(enddate), 
		"eventlocation" : eventlocation, 
		"eventmap" : eventmap, 
		"eventpicture" : eventPicture,
		
		// Other Default Fields
		
		"exhibitions_hosted" : [], 				// Supposed to store Exhibition IDs that the Event has
		"tags" : [], 							// Supposed to store Tags in the form of Strings
		
	};
}