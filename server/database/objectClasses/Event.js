const ModelHandler = require('../models/ourModels.js');

const config = require('../../config.json');
const currentdb = require('../../currentdb.js');

const username = config[currentdb].username;
const password = config[currentdb].password;
const host = config[currentdb].host;
const port = config[currentdb].port;
const dbName = config[currentdb].database;

/**
 * This is the wrapper class used extract out and store information
 * about the Events from the database between view and model
 *
 */

class Event {

  /**
   * Creates a connection to the database
   */
  static connectDB() {
    this.ModelHandler = new ModelHandler().initWithParameters(username, password, host, port, dbName);
    this.EventModel = this.ModelHandler.getEventModel();
  }

  /**
   * Disconnects from the database
   */
  static disconnectDB() {
    this.ModelHandler.disconnect();
  }

  /**
   * Creates an Event model instance.
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
  constructor(eventName = '', eventDescription = '', startDate, endDate, location, map, eventPicture = '', tags = []) {
    this.ModelHandler = new ModelHandler().initWithParameters(username, password, host, port, dbName);
    this.EventModel = this.ModelHandler.getEventModel();
    this.eventModelDoc = new this.EventModel({
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
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  saveEvent(callback) {
    Event.connectDB();
    this.eventModelDoc.save((err) => {
      Event.disconnectDB();
      callback(err);
    });
  }

  /**
   * Retrieve all Events listed in the database
   *
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static getAllEvents(callback) {
    Event.connectDB();
    this.EventModel.find({}, (err, eventObj) => {
      Event.disconnectDB();
      callback(err, eventObj);
    });
  }

  /**
   * Retrieve a specific event listed in the database
   *
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static getEvent(eventName, callback) {
    Event.connectDB();
    this.EventModel.findOne({ event_name: eventName }, (err, eventObj) => {
      Event.disconnectDB();  
      callback(err, eventObj);
    });
  }

  /**
   * Checks whether the event is existing within the database. Will callback a boolean value.
   *
   * @param {String} eventName: unique identifer used to check against database
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static isExistingEvent(eventName, callback) {
    Event.connectDB();
    this.EventModel.findOne({ event_name: eventName }, (err, docs) => {
      Event.disconnectDB();
      if (err) {
        callback(err, null);
      } else if (docs) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    });
  }

  /**
   * Retrieve all the event with the specificed tag listed in the database
   *
   * @param {String} eventName: unique identifer used to check against database.
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static searchEventsByTag(tag, callback) {
    Event.connectDB();
    this.EventModel.find({ tags: { $regex: new RegExp(tag.replace('+', '\\+'), 'i') } }, (err, docs) => {
      Event.disconnectDB();
      callback(err, docs);
    });
  }

  /**
   * Updates an model instance.
   *
   * @param {String} eventName: Unique identifier for the object.
   * @param {String} eventDescription: Description for the event.
   * @param {Date} startDate: Date object to identify start of event.
   * @param {Date} endDate: Date object to identify end of event.
   * @param {String} location: Description of location, e.g how to get there.
   * @param {Object} map: Object for an interactive map.
   * @param {String} eventPicture: URL string expected.
   * @param {String Array} tags: Tags used to identify events.
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static updateEvent(eventName = '', eventDescription = '', startDate, endDate, location, map, eventPicture = '', tags = [], callback) {
    Event.connectDB();
    const update = { 
      event_name: eventName,
      event_description: eventDescription,
      start_date: startDate,
      end_date: endDate,
      event_location: location,
      event_map: map,
      event_picture: eventPicture,
      tags: tags,
    };
    const options = { new: true };
    this.EventModel.findOneAndUpdate(
      {event_name: eventName },
      update,
      options,
      (err, results) => {
        Event.disconnectDB();
        callback(err,results);
      });
  }

  /**
   * Removes all event from the Database
   *
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static clearAllEvents(callback) {
    Event.connectDB();
    this.EventModel.collection.remove({}, (err) => {
      Event.disconnectDB();
      callback(err);
    });
  }

  /**
   * Removes a specific event from the Database
   *
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static deleteEvent(eventName, callback) {
    Event.connectDB();
    this.EventModel.findOneAndRemove({ event_name: eventName }, (err) => {
      Event.disconnectDB();
      callback(err);
    });
  }
}
module.exports = Event;
