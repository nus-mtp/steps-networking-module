const ModelHandler = require('../models/ourModels.js');

const config = require('../../config.json');
const currentdb = require('../../currentdb.js');

const username = config[currentdb].username;
const password = config[currentdb].password;
const host = config[currentdb].host;
const port = config[currentdb].port;
const dbName = config[currentdb].database;

/**
 * This is the wrapper class used extract out and store information about the
 * Exhibitions from the Database between view and model.
 */

class Exhibition {

  /**
   * Creates a connection to the Database
   */
  static connectDB() {
    this.ModelHandler = new ModelHandler()
          .initWithParameters(username, password, host, port, dbName);
    this.exhibitionModel = this.ModelHandler.getExhibitionModel();
  }

  /**
   * Disconnects from the database
   */
  static disconnectDB() {
    this.ModelHandler.disconnect();
  }

  /**
   * Creates an Exhibition Document and stores it internally.
   *
   * @param exhibitionName: The name for the Exhibition.
   * @param exhibitionDescription: The description for the Exhibition.
   * @param eventName: The name of the Event that the Exhibition is found in.
   * @param posterURL: URL string representing where the poster of the Exhibition is hosted.
   * @param images: List of URL strings representing images related to the Exhibition.
   * @param videos: List of URL strings representing videos related to the Exhibition.
   * @param website: URL string linking to the Exhibition's external webpage.
   * @param tags: List of tags that can be used to search for Exhibitions.
   */
  constructor(exhibitionName = '', exhibitionDescription = '', eventName, posterURL, images, videos, website, tags) {
    this.ModelHandler = new ModelHandler()
        .initWithParameters(username, password, host, port, dbName);
    this.exhibitionModel = this.ModelHandler.getExhibitionModel();
    this.exhibition = new this.exhibitionModel({
      exhibition_name: exhibitionName,
      exhibition_description: exhibitionDescription,
      event_name: eventName,
      poster: posterURL,
      images,
      videos,
      website,
      tags,
    });
    this.ModelHandler.disconnect();
  }

  /**
   * Saves Exhibition Document stored internally to the Database.
   *
   * @param callback: A function that is executed once the operation is done.
   */
  saveExhibition(callback) {
    Exhibition.connectDB();
    this.exhibition.save((err) => {
      Exhibition.disconnectDB();
      callback(err);
    });
  }

  /**
   * Checks whether the Exhibition exists within the Database. Will callback a boolean value.
   *
   * @param exhibitionName: The name of the Exhibition to search for.
   * @param callback: A function that is executed once the operation is done.
   */
  static isExistingExhibition(exhibitionName, callback) {
    Exhibition.connectDB();
    this.exhibitionModel.findOne({ exhibition_name: exhibitionName }, (err, exhibition) => {
      Exhibition.disconnectDB();
      if (err) {
        callback(err, false);
      } else if (exhibition) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    });
  }

  /**
   * Retrieve a specific Exhibition in the Database.
   *
   * @param exhibitionName: The name of the Exhibition to retrieve from the Database.
   * @param callback: A function that is executed once the operation is done.
   */
  static getExhibition(exhibitionName, callback) {
    Exhibition.connectDB();
    this.exhibitionModel.findOne({ exhibition_name: exhibitionName }, (err, exhibition) => {
      Exhibition.disconnectDB();
      callback(err, exhibition);
    });
  }

  /**
   * Retrieve all Exhibitions in the current Database.
   *
   * @param callback: A function that is executed once the operation is done.
   */
  static getAllExhibition(callback) {
    Exhibition.connectDB();
    this.exhibitionModel.find({}, (err, allExhibitions) => {
      Exhibition.disconnectDB();
      callback(err, allExhibitions);
    });
  }

  /**
   * Retrieve all the Exhibitions tagged with the specified tag.
   *
   * @param tag: The tag to check each Exhibition for.
   * @param callback: A function that is executed once the operation is done.
   */
  static searchExhibitionsByTag(tag, callback) {
    Exhibition.connectDB();
    this.exhibitionModel.find({ tags: { $regex: new RegExp(tag.replace('+', '\\+'), 'i') } }, (err, matchedExhibitions) => {
      Exhibition.disconnectDB();
      callback(err, matchedExhibitions);
    });
  }

  /**
   * Retrieve all the Exhibitions that is hosted under a single Event.
   *
   * @param eventName: The unique name of the Event to search under.
   * @param callback: A function that is executed once the operation is done.
   */
  static searchExhibitionsByEvent(eventName, callback) {
    Exhibition.connectDB();
    this.exhibitionModel.find({ event_name: { $regex: new RegExp(eventName.replace('+', '\\+'), 'i') } }, (err, docs) => {
      Exhibition.disconnectDB();
      callback(err, docs);
    });
  }

  /**
   * Updates the all information in a specified Exhibition - except the exhibitionName.
   *
   * @param exhibitionName: The name of the Exhibition to update.
   * @param exhibitionDescription: The description of the Exhibition.
   * @param eventName: The name of the Event that the Exhibition is found in.
   * @param posterURL: URL string representing where the poster of the Exhibition is hosted.
   * @param images: List of URL strings representing images related to the Exhibition.
   * @param videos: List of URL strings representing videos related to the Exhibition.
   * @param website: URL string linking to the Exhibition's external webpage.
   * @param tags: List of tags that can be used to search for Exhibitions.
   * @param callback: A function that is executed once the operation is done.
   */
  static updateExhibition(exhibitionName = '', exhibitionDescription = '', eventName, posterURL, images, videos, website, tags, callback) {
    Exhibition.connectDB();
    const update = { exhibition_name: exhibitionName,
      exhibition_description: exhibitionDescription,
      event_name: eventName,
      poster: posterURL,
      images,
      videos,
      website,
      tags,
    };
    const options = { new: true };
    this.exhibitionModel
        .findOneAndUpdate({ exhibition_name: exhibitionName },
            update,
            options,
            (err, results) => {
              Exhibition.disconnectDB();
              callback(err, results);
            },
    );
  }

  /**
   * Removes a specific Exhibition from the Database.
   *
   * @param exhibitionName: The name of the Exhibition to delete for.
   * @param callback: A function that is executed once the operation has completed.
   */
  static deleteExhibition(exhibitionName, callback) {
    Exhibition.connectDB();
    this.exhibitionModel.findOneAndRemove({ exhibition_name: exhibitionName }, (err) => {
      Exhibition.disconnectDB();
      callback(err);
    });
  }

  /**
   * Removes all Exhibitions from the Database.
   *
   * @param callback: A function that is executed once the operation is done.
   */
  static clearAllExhibitions(callback) {
    Exhibition.connectDB();
    this.exhibitionModel.collection.remove({}, (err) => {
      Exhibition.disconnectDB();
      callback(err);
    });
  }
}
module.exports = Exhibition;
