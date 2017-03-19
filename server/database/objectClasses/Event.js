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
 * about the Events from the Database between view and model.
 *
 */

class Event {
  /**
   * Creates a connection to the Database.
   */
  static connectDB() {
    this.ModelHandler = new ModelHandler()
        .initWithParameters(username, password, host, port, dbName);
    this.EventModel = this.ModelHandler.getEventModel();
  }

  /**
   * Disconnects from the Database.
   */
  static disconnectDB() {
    this.ModelHandler.disconnect();
  }

  /**
   * Creates an Event Document and stores it internally.
   *
   * @param {String} eventName: The unique email for this Event.
   * @param {String} eventDescription: The description for the Event.
   * @param {Date} startDate: Date object to identify start of Event.
   * @param {Date} endDate: Date object to identify end of Event.
   * @param {String} location: The description of location, e.g how to get there
   * @param {String} map: URL String representing an externally hosted interactive map.
   * @param {String} eventPicture:
   *    URL String representing an externally hosted depiction of the Event.
   * @param {Array} tags: A list of tags used to identify Events.
   */
  constructor(eventName = '', eventDescription = '', startDate, endDate, location, map, eventPicture = '', tags = []) {
    this.ModelHandler = new ModelHandler()
        .initWithParameters(username, password, host, port, dbName);
    this.EventModel = this.ModelHandler.getEventModel();
    this.eventModelDoc = new this.EventModel({
      event_name: eventName,
      event_description: eventDescription,
      start_date: startDate,
      end_date: endDate,
      event_location: location,
      event_map: map,
      event_picture: eventPicture,
      tags,
    });
    this.ModelHandler.disconnect();
  }

  /**
   * Saves the Event Document stored internally to the Database.
   *
   * @param {function} callback: A function that executes after the operation is done.
   */
  saveEvent(callback) {
    Event.connectDB();
    this.eventModelDoc.save((err, result) => {
      Event.disconnectDB();
      callback(err, result);
    });
  }

  /**
   * Retrieve a specific Event listed in the Database.
   *
   * @param {String} eventName: A unique identifier for the Event.
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static getEvent(eventName, callback) {
    Event.connectDB();
    this.EventModel.findOne({ event_name: eventName }, (err, event) => {
      Event.disconnectDB();
      callback(err, event);
    });
  }

  /**
   * Retrieve all Events from the Database.
   *
   * @param {function} callback: A function that executes after the operation is done.
   */
  static getAllEvents(callback) {
    Event.connectDB();
    this.EventModel.find({}, (err, allEvents) => {
      Event.disconnectDB();
      callback(err, allEvents);
    });
  }

  /**
   * Checks whether the Event is existing within the Database. Will callback a boolean value.
   *
   * @param {String} eventName: A unique identifier for the Event.
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static isExistingEvent(eventName, callback) {
    Event.connectDB();
    this.EventModel.findOne({ event_name: eventName }, (err, result) => {
      Event.disconnectDB();
      if (err || !result) {
        callback(err, false);
      } else {
        callback(null, true);
      }
    });
  }

  /**
   * Retrieve all the Event with the specified tags listed in the Database.
   *
   * @param {Array} tag: List of tags that can be used to search for Exhibitions.
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static searchEventsByTag(tag, callback) {
    Event.connectDB();
    this.EventModel.find({ tags: { $regex: new RegExp(tag.replace('+', '\\+'), 'i') } }, (err, matchedEvents) => {
      Event.disconnectDB();
      callback(err, matchedEvents);
    });
  }

  /**
   * Updates the all information in a specified Event - except the eventName.
   *
   * @param {String} eventName: The unique email for this Event.
   * @param {String} eventDescription: The description for the Event.
   * @param {Date} startDate: Date object to identify start of Event.
   * @param {Date} endDate: Date object to identify end of Event.
   * @param {String} location: The description of location, e.g how to get there
   * @param {Object} map: URL String representing an externally hosted interactive map.
   * @param {String} eventPicture:
   *    URL String representing an externally hosted depiction of the Event.
   * @param {Array} tags: A list of tags used to identify Events.
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
      tags,
    };
    const options = { new: true };
    this.EventModel.findOneAndUpdate(
      { event_name: eventName },
      update,
      options,
      (err, results) => {
        Event.disconnectDB();
        callback(err, results);
      });
  }

  /**
   * Removes a specific event from the Database.
   *
   * @param {String} eventName: A unique identifier for the Event.
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static deleteEvent(eventName, callback) {
    Event.connectDB();
    this.EventModel.findOneAndRemove({ event_name: eventName }, (err) => {
      Event.disconnectDB();
      callback(err);
    });
  }

  /**
   * Removes all event from the Database.
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
}
module.exports = Event;
