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
 *
 */

class Exhibition {
  /**
   * Creates an Exhibition Document and stores it internally.
   *
   * @param exhibitionName: Unique identifier for the object
   * @param exhibitionDescription: Description for the event
   * @param eventName: Name of the event that the exhibition is found in
   * @param posterURL: url string for where poster is hosted.
   * @param images: list of url for images to be found.
   * @param videos: list of url for videos to be found.
   * @param website: url for the exhibition page
   * @param tags: Tags used to identify exhibitions
   */
  constructor(exhibitionName = '', exhibitionDescription = '', eventName, posterURL, images, videos, website, tags) {
    this.ModelHandler = new ModelHandler()
        .initWithParameters(username, password, host, port, dbName);
    this.ExhibModel = this.ModelHandler.getExhibitionModel();
    this.exhibModelDoc = new this.ExhibModel({
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
   * @param callback: used for error checking
   */
  saveExhibition(callback) {
    Exhibition.connectDB();
    this.exhibModelDoc.save((err) => {
      Exhibition.disconnectDB();
      callback(err);
    });
  }

  static connectDB() {
    this.ModelHandler = new ModelHandler()
        .initWithParameters(username, password, host, port, dbName);
    this.ExhibModel = this.ModelHandler.getExhibitionModel();
  }

  static disconnectDB() {
    this.ModelHandler.disconnect();
  }

  /**
   * Removes all Exhibitions from the Database.
   *
   * @param callback: used for error checking
   */
  static clearAllExhibitions(callback) {
    Exhibition.connectDB();
    this.ExhibModel.collection.remove({}, (err) => {
      Exhibition.disconnectDB();
      if (err) {
        callback(err);
      }
    });
  }

  /**
   * Removes a specific Exhibition from the Database.
   *
   * @param exhibitionName: The name of the Exhibition to delete for.
   * @param callback: used for error checking
   */
  static deleteExhibition(exhibitionName, callback) {
    Exhibition.connectDB();
    this.ExhibModel.findOneAndRemove({ exhibition_name: exhibitionName }, (err) => {
      Exhibition.disconnectDB();
      if (err) {
        callback(err);
      }
    });
  }

  /**
   * Retrieve all the Exhibitions in the current Database.
   *
   * @param callback: used for error checking
   */
  static getAllExhibition(callback) {
    Exhibition.connectDB();
    this.ExhibModel.find({}, (err, exhibObj) => {
      Exhibition.disconnectDB();
      if (err) {
        callback(err, null);
      } else {
        // exhibObj is an array of Exhibition objects
        callback(null, exhibObj);
      }
    });
  }

  /**
   * Retrieve a specific Exhibition in the Database.
   *
   * @param exhibitionName: The name of the Exhibition to retrieve from the Database.
   * @param callback: used for error checking
   */
  static getExhibition(exhibitionName, callback) {
    Exhibition.connectDB();
    this.ExhibModel.findOne({ exhibition_name: exhibitionName }, (err, exhibObj) => {
      Exhibition.disconnectDB();
      if (err) {
        callback(err, null);
      } else {
        callback(null, exhibObj);
      }
    });
  }

  /**
   * Updates the Exhibition Document stored within this Object.
   *
   * @param exhibitionName: Unique Identifier for this Exhibition.
   * @param exhibitionDescription: Description for the Exhibition.
   * @param eventName: Name of the Event that the Exhibition is found in.
   * @param posterURL: String for where the Exhibition's poster is hosted.
   * @param images: List of URL for Exhibition's Images.
   * @param videos: List of URL for Exhibition's Videos.
   * @param website: URL to the Exhibition's external website.
   * @param tags: Tags used to identify this Exhibition.
   * @param callback: used for error checking
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
    this.ExhibModel
        .findOneAndUpdate({ exhibition_name: exhibitionName },
            update,
            options,
            (err, results) => {
              Exhibition.disconnectDB();
              if (err) {
                console.log('Unable to update exhibition');
                callback(err);
              } else if (results) {
                console.log('Exhibition is updated.');
              } else {
                console.log('There is no such exhibition.');
              }
            },
    );
  }

  /**
   * Checks whether the Exhibition exists within the Database. Will callback a boolean value.
   *
   * @param exhibitionName: Unique Identifier for the Exhibition.
   * @param callback: used for error checking
   */
  static isExistingExhibition(exhibitionName, callback) {
    Exhibition.connectDB();
    this.ExhibModel.findOne({ exhibition_name: exhibitionName }, (err, docs) => {
      Exhibition.disconnectDB();
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
   * Retrieve all the Exhibitions tagged with the specified Tag.
   *
   * @param tag: The Tag to check each Exhibition for.
   * @param callback: used for error checking
   */
  static searchExhibitionsByTag(tag, callback) {
    Exhibition.connectDB();
    this.ExhibModel.find({ tags: { $regex: new RegExp(tag.replace('+', '\\+'), 'i') } }, (err, docs) => {
      Exhibition.disconnectDB();
      if (err) {
        callback(err, null);
      } else {
        callback(null, docs);
      }
    });
  }

  /**
   * Retrieve all the Exhibitions that is hosted under a single Event.
   *
   * @param eventName: Unique identifier for the Event to search under.
   * @param callback: used for error checking
   */
  static searchExhibitionsByEvent(eventName, callback) {
    Exhibition.connectDB();
    this.ExhibModel.find({ event_name: { $regex: new RegExp(eventName.replace('+', '\\+'), 'i') } }, (err, docs) => {
      Exhibition.disconnectDB();
      if (err) {
        callback(err, null);
      } else {
        callback(null, docs);
      }
    });
  }
}
module.exports = Exhibition;
