const removeDuplicates = require('../../utils/utils').removeDuplicates;
const ModelHandler = require('../models/ourModels.js');

/**
 * This is the wrapper class used extract out and store information
 * about the Events from the Database between view and model.
 *
 */

class Event {
  /**
   * Establishes the Event Model on an existing connection.
   *
   * @param {Mongoose.Connection} db: The connection to the db.
   */
  static setDBConnection(db) {
    if (!Event.db || !Event.EventModel) {
      Event.db = db;
      Event.EventModel = new ModelHandler().initWithConnection(db).getEventModel();
    }
  }

  /**
   * A function which checks whether the Database connection can be used.
   *
   * @returns {Mongoose.Connection|*|*|Aggregate|Model|boolean}
   */
  static checkConnection() {
    return (Event.db && Event.EventModel &&
      (Event.db.readyState === 1 || Event.db.readyState === 2));
  }

  /**
   * Creates an Event JSON and stores it internally.
   *
   * @param {String} eventName: The unique email for this Event.
   * @param {String} eventDescription: The description for the Event.
   * @param {Date} startDate: Date object to identify start of Event.
   * @param {Date} endDate: Date object to identify end of Event.
   * @param {String} location: The description of location, e.g how to get there
   * @param {String} map: String representing an externally hosted interactive map.
   * @param {String} eventPicture:
   *    URL String representing an externally hosted depiction of the Event.
   * @param {Array} tags: A list of tags used to identify Events.
   */
  constructor(eventName = '', eventDescription = '', startDate, endDate, location, map, eventPicture = '', tags = []) {
    this.eventJSON = {
      event_name: eventName,
      event_description: eventDescription,
      start_date: startDate,
      end_date: endDate,
      event_location: location,
      event_map: map,
      event_picture: eventPicture,
      tags: tags.map(tag => tag.trim().toLowerCase()),
    };
  }

  /**
   * Saves the Event JSON to the Database as an actual Document.
   *
   * @param {function} callback: A function that executes after the operation is done.
   */
  saveEvent(callback) {
    if (Event.checkConnection()) {
      const eventDoc = new Event.EventModel(this.eventJSON);
      eventDoc.save((err, result) => {
        callback(err, result);
      });
    } else {
      callback(null);
    }
  }

  /**
   * Retrieve a specific Event listed in the Database.
   *
   * @param {String} eventName: A unique identifier for the Event.
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static getEvent(eventName, callback) {
    if (Event.checkConnection()) {
      Event.EventModel.findOne({ event_name: eventName }, (err, event) => {
        callback(err, event);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve a specific Event from the Database, using its ID.
   *
   * @param {mongoose.Schema.ObjectId} eventId:
   *    The id of the event to search for.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static getEventById(eventId, callback) {
    if (Event.checkConnection()) {
      Event.EventModel.findById(eventId, (err, event) => {
        callback(err, event);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve all Events from the Database.
   *
   * @param {function} callback: A function that executes after the operation is done.
   */
  static getAllEvents(callback) {
    if (Event.checkConnection()) {
      Event.EventModel.find({}, (err, allEvents) => {
        callback(err, allEvents);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Checks whether the Event is existing within the Database. Will callback a boolean value.
   *
   * @param {String} eventName: A unique identifier for the Event.
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static isExistingEvent(eventName, callback) {
    if (Event.checkConnection()) {
      Event.EventModel.findOne({ event_name: eventName }, (err, result) => {
        if (err || !result) {
          callback(err, false);
        } else {
          callback(null, true);
        }
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve all the Event with the specified tags listed in the Database.
   *
   * @param {Array} tag: List of tags that can be used to search for Exhibitions.
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static searchEventsByTag(tag, callback) {
    if (Event.checkConnection()) {
      Event.EventModel.find({ tags: { $regex: new RegExp(tag.replace('+', '\\+'), 'i') } }, (err, matchedEvents) => {
        callback(err, matchedEvents);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Updates the all information in a specified Event - except the eventName.
   *
   * @param {String} eventName: The unique email for this Event.
   * @param {String} map: String representing an externally hosted interactive map.
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static updateEventMap(eventName = '', map, callback) {
    if (Event.checkConnection()) {
      const update = {
        event_map: map,
      };
      const options = { new: true };
      Event.EventModel.findOneAndUpdate(
          { event_name: eventName },
          update,
          options,
          (err, results) => {
            callback(err, results);
          });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Updates the all information in a specified Event - except the eventName.
   *
   * @param {String} eventName: The unique email for this Event.
   * @param {String} eventPicture:
   *    URL String representing an externally hosted depiction of the Event.
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static updateEventPicture(eventName = '', eventPicture = '', callback) {
    if (Event.checkConnection()) {
      const update = {
        event_picture: eventPicture,
      };
      const options = { new: true };
      Event.EventModel.findOneAndUpdate(
          { event_name: eventName },
          update,
          options,
          (err, results) => {
            callback(err, results);
          });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Updates the all information in a specified Event - except the eventName.
   *
   * @param {String} eventName: The unique email for this Event.
   * @param {Array} tags: A list of tags used to identify Events.
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static updateEventTag(eventName = '', tags = [], callback) {
    if (Event.checkConnection()) {
      const update = {
        tags,
      };
      const options = { new: true };
      Event.EventModel.findOneAndUpdate(
            { event_name: eventName },
            update,
            options,
            (err, results) => {
              callback(err, results);
            });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Removes a specific event from the Database.
   *
   * @param {String} eventName: A unique identifier for the Event.
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static deleteEvent(eventName, callback) {
    if (Event.checkConnection()) {
      Event.EventModel.findOneAndRemove({ event_name: eventName }, (err) => {
        callback(err);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Removes all event from the Database.
   *
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static clearAllEvents(callback) {
    if (Event.checkConnection()) {
      Event.EventModel.collection.remove({}, (err) => {
        callback(err);
      });
    } else {
      callback('Not Connected!', null);
    }
  }
}
module.exports = Event;
