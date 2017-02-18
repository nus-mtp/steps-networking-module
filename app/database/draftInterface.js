/*
	Subset of Fake Documents
*/
var user1 = {
    _id: "2384239",
    email: "user1@user.com",
    name: "user1",
    description: "I am user1.",
    password: "$2a$06$8Syy6cDw6Ncsdp7t2pCL2ORsuUKhmGTi2s8hEJGuDUfGHmEn1GK86", // plaintext: user1

    will_notify: false,
    is_deleted: false,
    profile_picture: "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1",

    skill_sets: ["programming", "algorithms"],
    bookmarked_users: ["user2@user.com"],
};

var user2 = {
    _id: "wiuei238",
    email: "user2@user.com",
    name: "user2",
    description: "I am user2.",
    password: "$2a$06$/rmJ6ttximt9.q7jR36Jce1v5jfe8MW2XCThfY1xEDzAUBEOtwAly", // plaintext: user2

    will_notify: false,
    is_deleted: false,
    profile_picture: "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1",

    skill_sets: ["programming", "gamedev", "design"],
    bookmarked_users: [],
};

var user3 = {
    _id: "238qfqf9",
    email: "user3@user.com",
    name: "user3",
    description: "I am user3.",
    password: "$2a$06$8lm19BOkfshp/7q6mJSLSebtjSBDFHoMopoVzKIDBIXvvwBh8H80S", // plaintext: user3

    will_notify: false,
    is_deleted: false,
    profile_picture: "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1",

    skill_sets: ["programming", "databases"],
    bookmarked_users: [],
};

var user4 = {
    _id: "23rrr2339",
    email: "user4@user.com",
    name: "user4",
    description: "I am user4.",
    password: "$2a$06$DLN.ULy2BGB0VgJX3lwNge5bWvE48n0Sra94p4KSmW2rqoFJX0M7W", // plaintext: user4

    will_notify: false,
    is_deleted: false,
    profile_picture: "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1",

    skill_sets: ["programming", "parallelism"],
    bookmarked_users: [],
};

var user5 = {
    _id: "2324fweffwe39",
    email: "user5@user.com",
    name: "user5",
    description: "I am user5.",
    password: "$2a$06$QJuXZzeRxTqhUc5uCHHoS.agkkgNGhk2zTx6MtxOZzXpTbFRBvMbO", // plaintext: user5

    will_notify: false,
    is_deleted: false,
    profile_picture: "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fi.imgur.com%2Fp7HfgdZ.png&f=1",

    skill_sets: ["business", "marketing"],
    bookmarked_users: [],

};

var event1 = {
    _id: "ufh32u3f",
    event_name: "10th Steps",
    event_description: "the first event",
    start_date: new Date('Feburary 28, 2017 19:00:00'),
    end_date: new Date('Feburary 28, 2017 21:00:00'),
    event_location: "",
    event_map: "",
    event_picture: "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.proto.gr%2Fsites%2Fdefault%2Ffiles%2Fstyles%2Fcolorbox%2Fpublic%2Fimages%2Ffruits%2Fapple.png&f=1",

    tags: ["10th Steps", "computing", "cs3283", "cs3247"],

};
var event2 = {
    _id: "uh21fsddf",
    event_name: "9th Steps",
    event_description: "the second event",
    start_date: new Date('May 8, 2017 00:00:00'),
    end_date: new Date('August 1, 2017 23:59:00'),
    event_location: "",
    event_map: "",
    event_picture: "https://images.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.pngpix.com%2Fwp-content%2Fuploads%2F2016%2F03%2FOrange-Fruit-PNG-image-2.png&f=1",

    tags: ["9th Steps", "computing", "cs4350"],

};

var exhibition1 = {
    _id: "wef329f832f",
    exhibition_name: "steps-networking-module",
    exhibition_description: "placeholder",

    event_name: "10th Steps",

    images: [],
    video: [],
    blog: "",

    tags: ["computing", "cs3283"],
};

var exhibition2 = {
    _id: "wef3242342f",
    exhibition_name: "movie-pigeon",
    exhibition_description: "placeholder",

    event_name: "10th Steps",

    images: [],
    video: [],
    blog: "",

    tags: ["computing", "cs3283"],
};

var exhibition3 = {
    _id: "ry983298r3",
    exhibition_name: "Mama!Lava!",
    exhibition_description: "A vertical VR endless runner.",

    event_name: "9th Steps",

    images: [],
    video: [],
    blog: "",

    tags: ["computing", "cs4350"],
};

var attendance1 = {
    _id: "wefuwwuifie",
    user_email: "user1@user.com",
    name: "9th Steps",
    type: "event",
    reason: ["Just Visiting"],
};

var attendance2 = {
    _id: "we141sad23ie",
    user_email: "user2@user.com",
    name: "Mama!Lava!",
    type: "exhibition",
    reason: ["Looking for Investors"],
};

var comment1 = {
    _id: "27r939r32r",
    user_email: "user1@user.com",
    exhibition: "Mama!Lava!",
    comment: "Cool Concept!",
};
var comment2 = {
    _id: "1asfdqh9r32r",
    user_email: "user1@user.com",
    exhibition: "movie-pigeon",
    comment: "ITS A BIRD!",
};

var comment3 = {
    _id: "2714123d32r",
    user_email: "user2@user.com",
    exhibition: "Mama!Lava!",
    comment: "ehehehehe",
};
/*
	Database Handler Object
*/

var users = [user1, user2, user3, user4, user5];
var events = [event1, event2];
var exhibitions = [exhibition1, exhibition2, exhibition3];
var attendances = [attendance1, attendance2];
var comments = [comment1, comment2, comment3];

var db = {
    "users": users,
    "events": events,
    "exhibitions": exhibitions,
    "attendances": attendances,
    "comments": comments,
};

/*
	Logical Interface

*/

/*
	Allows the search of a particular ID from a user defined list
    @param {string} ID: Unique string to identify object
    @param {arrayObj} arrayObj: The array of objects in which you are searching from. 
    e.g users, events, exhibitions, attendences, comments
    
    @return {Obj} arrayObj: the object with the matching ID
    @return null if not found
*/
function SearchID(ID, arrayObj) {
    for (var arrayIndex in arrayObj) {
        if (arrayObj[arrayIndex]._id == ID) {
            return arrayObj[arrayIndex];
        }
    }
    return null;
}

module.exports.SearchID = SearchID;


/*
	Allows for the searching of a particular User via their email.

    @param {string} userEmail: The email that User used to create the account. Unique to every User.

    @return {UserObj} userObj: The corresponding User object whose userEmail matches in the database. 
    @return null if User is not found in database.

*/
function getOneUser(userEmail) {

    for (var user in db["users"]) {
        var userObj = db["users"][user]
        if (userObj.email == userEmail) {
            return userObj;
        }
    }

    return null;
}

module.exports.getOneUser = getOneUser;

/*
	Retrieves a User's Profile Picture via their email.

    @param {string} userEmail: The email that User used to create the account. Unique to every User.

    @return {string} profilePictureURL: The URL to an externally hosted image site.
    @return null if User is not found in database.

*/
function getProfileUrl(userEmail) {

    var user = getOneUser(userEmail);
    return (user !== null) ? user.profile_picture : null;

}

module.exports.getProfileUrl = getProfileUrl;

/*
	Retrieves a User's Hashed Password.

    @param {string} userEmail: The email that user used to create the account. Unique to every User.

    @return {string} hashedPassword: The hashed, salted representation of the password stored.
    @return null if User is not found in database.    
*/
function getUserPassword(userEmail) {

    var user = getOneUser(userEmail);
    return (user !== null) ? user.password : null;
}

module.exports.getUserPassword = getUserPassword;

/*
	Allows for the searching of a particular Exhibition via its name.

    @param {string} exhibitionName: The name of the Exhibition. Unique to every Exhibition.

    @return {EventObj} eventObj: The corresponding Exhibition object whose Exhibition_name matches in the database.
    @return null if exhibition is not found in database.
*/
function getOneExhibition(exhibitionName) {

    for (var exhib in db["exhibitions"]) {
        var exhibObj = db["exhibitions"][exhib];
        if (exhibObj.exhibition_name == exhibitionName) {
            return exhibObj;
        }
    }
    return null;
}

module.exports.getOneExhibition = getOneExhibition;

/*
	Retrieves an array of Comments based on Exhibition name.

    @param {string} exhibitionName: name of Exhibition which the Comments belongs to.

    @returns {ObjArray} commentArray: Array of Comments in no special order.
*/
function getComments(exhibitionName) {
    var commentArray = [];
    for (var exhib in db["comments"]) {
        var exhibObj = db["comments"][exhib];
        if (exhibObj.exhibition == exhibitionName) {
            commentArray.push(exhibObj);
        }
    }
    return commentArray;
}

module.exports.getComments = getComments;

/* 
	Retrieves Exhibitions by Tags.

    @param {string} tag: A specified string specifying the Tag contents.

    @return {ObjArray} matchingExhibitions: Array of Exhibitions which have the Tag.
*/
function searchExhibitionsByTag(tag) {

    var filterArray = [];

    for (var index in db["exhibitions"]) {
        //iterate through tags array
        var tagObj = db["exhibitions"][index];
        for (var tagIndex in tagObj.tags) {
            if (tagObj.tags[tagIndex] == tag) {
                filterArray.push(tagObj);
            }
        }
    }
    return filterArray;
}

module.exports.searchExhibitionsByTag = searchExhibitionsByTag;

/*
	Allows for the searching of a particular Event via its name.

    @param {string} eventName: The name of the Event. Unique to every Event.

    @return {EventObj} event: The corresponding Event object with the same eventname.
    @return null if not found.
*/
function getOneEvent(eventName) {

    //uses db from backend
    for (var event in db["events"]) {
        if (db["events"][event].event_name == eventName)
            return db["events"][event];
    };
    return null;
};

module.exports.getOneEvent = getOneEvent;

/*
	Retrieve the list of all Events.

    @return {ObjArray} 
*/
function getAllEvents() {
    return db["events"];
}

module.exports.getAllEvents = getAllEvents;

/*
	Retrieve an Array of all ongoing Events.
    
    @return {ObjArray} eventArray: All Events currently happening at this moment.
*/
function getOnGoingEvents() {

    var results = [];
    var eventArray = getAllEvents();

    for (var event in eventArray) {
        var now = Date.now();

        if (eventArray[event].start_date < now &&
            eventArray[event].end_date > now) {
            results.push(eventArray[event]);
        }
    };

    return results;
}

module.exports.getOnGoingEvents = getOnGoingEvents;

/*
	Retrieve an Array of all upcoming Events.
    
    @return {ObjArray} eventArray: All Events that have not occurred yet.
*/
function getUpcomingEvents() {

    var results = [];
    var eventArray = getAllEvents();

    for (var event in eventArray) {
        var now = Date.now();

        if (eventArray[event].start_date > now &&
            eventArray[event].end_date > now) {
            results.push(eventArray[event]);
        }
    };

    return results;
}

module.exports.getUpcomingEvents = getUpcomingEvents;

/*
	Retrieve an Array of all completed Events.
    
    @return {ObjArray} eventArray: All Events that have already occurred.
*/
function getPastEvents() {

    var results = [];
    var eventArray = getAllEvents();

    for (var event in eventArray) {
        var now = Date.now();

        if (eventArray[event].start_date < now &&
            eventArray[event].end_date < now) {
            results.push(eventArray[event]);
        }
    };

    return results;
}

module.exports.getPastEvents = getPastEvents;