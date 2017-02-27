var ModelHandler = require("../mongodbscripts/models.js");
const port = "27017";
const host = "localhost";
const dbName = "fake-data";

/**
 * This is the wrapper class used extract out and store information about the Events from the database between view and model
 *
 */

class Event{
  constructor(eventName = "", eventDescription = "", startDate, endDate, location, map, eventPicture = "", tags=[]) {
    this.ModelHandler = new ModelHandler (host, port, dbName);
    this.eventModel = this.ModelHandler.getEventModel();
    this.eventModelDoc = new this.eventModel({  
      event_name: eventName,
      event_description: eventDescription,
      start_date: startDate,
      end_date: endDate,
      event_location: location,
      event_map: map,
      event_picture: eventPicture,
      tags: tags,
    });
    this.saveEvent(function callback(err){
      if (err){
        if (err.name === 'MongoError' && err.code === 11000) {
          //Report and abort.
          console.log("There is an existing user with the same eventName");
          console.log(err);
        }
      }
    });
    this.ModelHandler.disconnect();
  }

  saveEvent(callback){
    this.eventModelDoc.save(function(err){
      if (err){
        callback(err);
      } else {
        console.log("Event is added");
      }
    });
  }
  
  static makeConnection(){
    this.ModelHandler = new ModelHandler (host, port, dbName);
    this.eventModel = this.ModelHandler.getEventModel();
  }
  
  static breakConnection(){
    this.ModelHandler.disconnect();
  }
  
  static clearAllEvents(){
    Event.makeConnection();
    this.eventModel.collection.remove({});
    Event.breakConnection();
  }

  static getAllEvents(callback){
    Event.makeConnection();
    this.eventModel.find({}, function(err, eventObj){
      if (err){
        callback(err,null);
      } else {
        console.log("SEARCH ALL EVENTS: "+eventObj);
        callback(null, eventObj);
      }
    });
    Event.breakConnection();
  }
  
  static getEvent(eventName, callback){
    Event.makeConnection();
    this.eventModel.findOne({event_name: eventName},function (err, eventObj){
      if (err){
        callback(err, null);
      } else {
        callback(null, eventObj);
      }
    });
    Event.breakConnection();
  }
}
module.exports = Event;



/**
   * This method takes in an email and returns a match in the database
   * To use this function use 
   * getUser(email, function functionName(err, docs){
   *     if (err){
   *      //error handling
   *    } else {
   *    //do anything to doc here. docs is the UserObject.
   *    //To access attribute, use docs.[attribute];
   *    }
   *  });
   *  
   * @param {String} email
   * @param {function} cb
   */
/*static getUser(email, cb){
  this.ModelHandler = new ModelHandler (host, port, dbName);
  this.userModel = this.ModelHandler.getUserModel();
  this.userModel.findOne({ 'email': email }, function(err, docs) {
    if (err){
      cb(err, null)
    }
    cb(null,docs);
  });
  this.ModelHandler.disconnect();
}

/**
   * This method updates overwrites all the current attribute content (except email) with the user input content 
   *
   * @param {String} email: used as an identifer for the respective user instance
   * @param {String} name: name of user
   * @param {String} description: a summary of the user
   * @param {String} password: user's password in plain string
   * @param {Boolean} will_notify: To determine if the user wants to be notified of new messages by email
   * @param {Boolean} is_deleted: To determine if this user is still valid in the database
   * @param {String} profile_pic: A url string which contains the profile picture.
   * @param {StringArray} skills_set: The skills that the user possess. Such as programming skills, management skills, etc
   * @param {StringArray} bookedmarked_users: A collection of users' emails that the current user wants to keep track of.
   */
/*static updateUser(email = "", name = "", description = "", password = "", will_notify = true, is_deleted = false, profile_pic = "", skill_sets = [], bookedmarked_users = []){

  //The list of  attributes that will be updated
  var update = {  email : email,
                name : name,
                description : description,
                password : password,
                will_notify : will_notify,
                is_deleted : is_deleted,
                profile_picture : profile_pic,
                skills : skill_sets,
                bookmarked_users : bookedmarked_users,
               }
  var options = {new: true};
  this.ModelHandler = new ModelHandler (host, port, dbName);
  this.userModel = this.ModelHandler.getUserModel();
  this.userModel.findOneAndUpdate({ 'email': email }, update, options, function(err, docs) {

    // Did something went wrong?
    if (err){
      console.log("Error with updating users.");
    } 
    // If not, is it existing?
    else if (docs) {
      console.log ("User is updated successfully");
    } 
    // No errors, and no existing document
    else {
      console.log ("There is no such users.")
    }
  });
  this.ModelHandler.disconnect();
}


/**
   * This methods filters the list of users base on a single skill
   *
   * @param {string} skillToBeSearched: the skill that is to be matched in the database.
   * @param {function} callback (err, docs): errors are stored in err, results are stored in docs.
   */
/*static searchUsersBySkills(skillToBeSearched, callback){
  this.ModelHandler = new ModelHandler (host, port, dbName);
  this.userModel = this.ModelHandler.getUserModel();
  this.userModel.find({ 'skills': { $regex: new RegExp(skillToBeSearched.replace('+',"\\+"),"i")} }, function(err, docs) {
    if (err){
      callback(err, null)
    }
    callback(null,docs);
  });
  this.ModelHandler.disconnect();
}

/**
   * This method checks if user is both existing and not marked as deleted in database
   *
   * @param {String} email: to be checked against database
   * @param {function} callback (err,results): errors are stored in err, results is boolean
   */
/*static isValidUser(email,callback){
  this.ModelHandler = new ModelHandler (host, port, dbName);
  this.userModel = this.ModelHandler.getUserModel();
  this.userModel.findOne({ 'email': email }, function (err, docs) {
    if (err){
      callback(err,null);
    } else if (docs) {
      if (!docs.is_deleted){
        callback(null, true);
      } else {
        callback(null, false);
      }
    } else {
      callback(null, false);
    }
  });
  this.ModelHandler.disconnect();
}

/**
   *This method marks a user as deleted from the database
   *
   * @param {String} email:  the email used to match in the database
   * @param {function} callback (err): any error is returned here
   */
/*static setUserAsDeleted(email, boolDeleted, callback){
  var update = {is_deleted : boolDeleted};
  var options = {new: true};
  this.ModelHandler = new ModelHandler (host, port, dbName);
  this.userModel = this.ModelHandler.getUserModel();
  this.userModel.findOneAndUpdate({ 'email': email },{$set: update}, options, function (err, docs) {
    if (err){
      callback(err, null);
    } else {
      callback(null, docs);
    } 

  });
  this.ModelHandler.disconnect();
}


}
module.exports = User;
*/