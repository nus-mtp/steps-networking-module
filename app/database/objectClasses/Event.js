var ModelHandler = require("../mongodbscripts/models.js");
const port = "27017";
const host = "localhost";
const dbName = "fake-data";

/**
 * This is the wrapper class used extract out and store information about the Events from the database between view and model
 *
 */

class Event{
  /**
   * Creates an model instance.
   * 
   * @param {String} eventName: Unique identifier for the object
   * @param {String} eventDescription: Description for the event
   * @param {Date} startDate: Date object to identify start of event
   * @param {Date} endDate: Date object to identify end of event
   * @param {String} location: Description of location, e.g how to get there
   * @param {Object} map: Object for an interactive map
   * @param {String} eventPicture: URL string expected
   * @param {String Array} tags: Tags used to identify events
   */
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
    this.ModelHandler.disconnect();
  }

  /**
   * saves event into Database
   *
   * @param {function} callback: used for error checking
   */
  saveEvent(callback){
    Event.connectDB();
    this.eventModelDoc.save(function(err){
      if (err){
        callback(err);
      }
    });
    Event.disconnectDB();
  }

  static connectDB(){
    this.ModelHandler = new ModelHandler (host, port, dbName);
    this.eventModel = this.ModelHandler.getEventModel();
  }

  static disconnectDB(){
    this.ModelHandler.disconnect();
  }

  /**
   * Removes all event from the Database
   *
   * @param {function} callback: used for error checking
   */
  static clearAllEvents(callback){
    Event.connectDB();
    this.eventModel.collection.remove({},callback);
    Event.disconnectDB();
  }

  /**
   * Removes a specific event from the Database
   *
   * @param {function} callback: used for error checking
   */
  static deleteEvent(eventName, callback){
    Event.connectDB();
    this.eventModel.findOneAndRemove({event_name: eventName}, function (err){
      if (err){
        callback(err);
      }
    });
    Event.disconnectDB();
  }

  /**
   * Retrieve all the event listed in the database
   *
   * @param {function} callback: used for error checking
   */
  static getAllEvents(callback){
    Event.connectDB();
    this.eventModel.find({}, function(err, eventObj){
      if (err){
        callback(err,null);
      } else {
        //eventObj is an array of Event objects
        callback(null, eventObj);
      }
    });
    Event.disconnectDB();
  }

  /**
   * Retrieve a specific event listed in the database
   *
   * @param {function} callback: used for error checking
   */
  static getEvent(eventName, callback){
    Event.connectDB();
    this.eventModel.findOne({'event_name': eventName},function (err, eventObj){
      if (err){
        callback(err, null);
      } else {
        callback(null, eventObj);
      }
    });
    Event.disconnectDB();
  }

  /**
   * Updates an model instance.
   * 
   * @param {String} eventName: Unique identifier for the object
   * @param {String} eventDescription: Description for the event
   * @param {Date} startDate: Date object to identify start of event
   * @param {Date} endDate: Date object to identify end of event
   * @param {String} location: Description of location, e.g how to get there
   * @param {Object} map: Object for an interactive map
   * @param {String} eventPicture: URL string expected
   * @param {String Array} tags: Tags used to identify events
   */
  static updateEvent(eventName = "", eventDescription = "", startDate, endDate, location, map, eventPicture = "", tags=[], callback) {
    Event.connectDB();
    var update = {event_name: eventName,
                  event_description: eventDescription,
                  start_date: startDate,
                  end_date: endDate,
                  event_location: location,
                  event_map: map,
                  event_picture: eventPicture,
                  tags: tags,
                 };
    var options = {new: true};
    this.eventModel.findOneAndUpdate({'event_name': eventName}, update, options, function (err, results){
      if (err){
        console.log("Unable to update Event");
        callback(err);
      } else if (results) {
        console.log("Event is updated.");
      } else {
        console.log("There is no such Event.");
      }
    });

    this.ModelHandler.disconnect();
  }

  /**
   * Checks whether the event is existing within the database. Will callback a boolean value.
   *
   * @param {String} eventName: unique identifer used to check against database
   * @param {function} callback: used for error checking
   */
  static isExistingEvent(eventName, callback){
    Event.connectDB();
    this.eventModel.findOne({'event_name': eventName}, function (err, docs){
      if (err){
        callback(err, null)
      } else if (docs){
        callback (null, true);
      } else {
        callback (null, false);
      }
    });
    Event.disconnectDB();
  }

  /**
   * Retrieve all the event with the specificed tag listed in the database
   *
   * @param {String} eventName: unique identifer used to check against database
   * @param {function} callback: used for error checking
   */
  static searchEventsByTag(tag, callback){
    Event.connectDB();
    this.eventModel.find({'tags': { $regex: new RegExp(tag.replace('+',"\\+"),"i")} }, function (err, docs){
      if (err){
        callback (err, null);
      } else {
        callback (null, docs);
      }
    });
    Event.disconnectDB();
  }
}
module.exports = Event;
