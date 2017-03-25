const removeDuplicates = require('../../utils/utils').removeDuplicates;
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
   * Creates a connection to the Database.
   */
  static connectDB() {
    this.ModelHandler = new ModelHandler()
          .initWithParameters(username, password, host, port, dbName);
    this.ExhibitionModel = this.ModelHandler.getExhibitionModel();
  }

  /**
   * Disconnects from the Database.
   *
   * @param {function} callback: A function to be executed upon disconnection.
   */
  static disconnectDB(callback) {
    this.ModelHandler.disconnect(callback);
  }

  /**
   * Creates an Exhibition Document and stores it internally.
   *
   * @param {String} exhibitionName: The name for the Exhibition.
   * @param {String} exhibitionDescription: The description for the Exhibition.
   * @param {String} eventName: The name of the Event that the Exhibition is found in.
   * @param {String} posterURL:
   *    URL string representing where the poster of the Exhibition is hosted.
   * @param {Array} images: List of URL strings representing images related to the Exhibition.
   * @param {Array} videos: List of URL strings representing videos related to the Exhibition.
   * @param {String} website: URL string linking to the Exhibition's external webpage.
   * @param {Array} tags: List of tags that can be used to search for Exhibitions.
   */
  constructor(exhibitionName = '', exhibitionDescription = '', eventName, posterURL, images, videos, website, tags) {
    this.ModelHandler = new ModelHandler()
        .initWithParameters(username, password, host, port, dbName);
    this.ExhibitionModel = this.ModelHandler.getExhibitionModel();
    this.exhibitionModelDoc = new this.ExhibitionModel({
      exhibition_name: exhibitionName,
      exhibition_description: exhibitionDescription,
      event_name: eventName,
      poster: posterURL,
      images,
      videos,
      website,
      tags: removeDuplicates(tags.map(tag => tag.trim().toLowerCase())),
    });
    this.ModelHandler.disconnect();
  }

  /**
   * Saves the Exhibition Document stored internally to the Database.
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  saveExhibition(callback) {
    Exhibition.connectDB();
    this.exhibitionModelDoc.save((err, result) => {
      Exhibition.disconnectDB(() => {
        callback(err, result);
      });
    });
  }

  /**
   * Checks whether the Exhibition exists within the Database. Will callback a boolean value.
   *
   * @param {String} eventName: The name of the Event that the Exhibition is held in.
   * @param {String} exhibitionName: The name of the Exhibition to search for.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static isExistingExhibition(eventName, exhibitionName, callback) {
    Exhibition.connectDB();
    this.ExhibitionModel.findOne({ event_name: eventName, exhibition_name: exhibitionName },
        (err, exhibition) => {
          Exhibition.disconnectDB(() => {
            if (err) {
              callback(err, false);
            } else if (exhibition) {
              callback(null, true);
            } else {
              callback(null, false);
            }
          });
        });
  }

  /**
   * Retrieve a specific Exhibition in the Database.
   *
   * @param {String} eventName: The name of the Event of which the Exhibition is held in.
   * @param {String} exhibitionName: The name of the Exhibition to retrieve from the Database.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static getExhibition(eventName, exhibitionName, callback) {
    Exhibition.connectDB();
    this.ExhibitionModel.findOne({ event_name: eventName, exhibition_name: exhibitionName },
        (err, exhibition) => {
          Exhibition.disconnectDB(() => {
            callback(err, exhibition);
          });
        });
  }

  /**
   * Retrieve a specific Exhibition in the Database, using its Id.
   *
   * @param {mongoose.Schema.ObjectId} exhibitionId:
   *    The id of an Exhibition to search for.
   * @param {function} callback: A function that executes once the operation is done.
   */
  static getExhibitionById(exhibitionId, callback) {
    Exhibition.connectDB();
    this.ExhibitionModel.findById(exhibitionId, (err, exhibition) => {
      Exhibition.disconnectDB(() => {
        callback(err, exhibition);
      });
    });
  }

  /**
   * Retrieve all Exhibitions in the current Database.
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static getAllExhibitions(callback) {
    Exhibition.connectDB();
    this.ExhibitionModel.find({}, (err, allExhibitions) => {
      Exhibition.disconnectDB(() => {
        callback(err, allExhibitions);
      });
    });
  }

  /**
   * Retrieve all the Exhibitions tagged with the specified tag.
   *
   * @param {String} tag: The tag to check each Exhibition for.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static searchExhibitionsByTag(tag, callback) {
    Exhibition.connectDB();
    this.ExhibitionModel.find({ tags: { $regex: new RegExp(tag.trim().toLowerCase().replace('+', '\\+'), 'i') } }, (err, matchedExhibitions) => {
      Exhibition.disconnectDB(() => {
        callback(err, matchedExhibitions);
      });
    });
  }

  /**
   * Retrieve all the Exhibitions that is hosted under a single Event.
   *
   * @param {String} eventName: The unique name of the Event to search under.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static searchExhibitionsByEvent(eventName, callback) {
    Exhibition.connectDB();
    this.ExhibitionModel.find({ event_name: { $regex: new RegExp(eventName.replace('+', '\\+'), 'i') } }, (err, docs) => {
      Exhibition.disconnectDB(() => {
        callback(err, docs);
      });
    });
  }

  /**
   * Sets the array of tags that this Exhibition has.
   *
   * @param {String} eventName: The name of the Event that the Exhibition is held in.
   * @param {String} exhibitionName: The name of the Exhibition to search for.
   * @param {Array} tags:
   *    The array of String objects that represent the tags tagged to this exhibiiton.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static setTagsForExhibition(eventName, exhibitionName, tags, callback) {
    Exhibition.connectDB();
    this.ExhibitionModel.findOne(
        { event_name: eventName, exhibition_name: exhibitionName },
        (err, exhibition) => {
          if (exhibition) {
            exhibition.set('tags', removeDuplicates(tags.map(tag => tag.trim().toLowerCase())));
            exhibition.save((err, updatedExhibition) => {
              Exhibition.disconnectDB(() => {
                callback(err, updatedExhibition);
              });
            });
          } else {
            Exhibition.disconnectDB(() => {
              callback(err, exhibition);
            });
          }
        });
  }

  /**
   * Updates the all information in a specified Exhibition - except the exhibitionName.
   *
   * @param {String} exhibitionName: The name for the Exhibition.
   * @param {String} exhibitionDescription: The description for the Exhibition.
   * @param {String} eventName: The name of the Event that the Exhibition is found in.
   * @param {String} posterURL:
   *    URL string representing where the poster of the Exhibition is hosted.
   * @param {Array} images: List of URL strings representing images related to the Exhibition.
   * @param {Array} videos: List of URL strings representing videos related to the Exhibition.
   * @param {String} website: URL string linking to the Exhibition's external webpage.
   * @param {Array} tags: List of tags that can be used to search for Exhibitions.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static updateExhibition(exhibitionName = '', exhibitionDescription = '', eventName, posterURL, images, videos, website, tags, callback) {
    Exhibition.connectDB();
    const update = {
      exhibition_description: exhibitionDescription,
      event_name: eventName,
      poster: posterURL,
      images,
      videos,
      website,
      tags: removeDuplicates(tags.map(tag => tag.trim().toLowerCase())),
    };
    const options = { new: true };
    this.ExhibitionModel
        .findOneAndUpdate({ exhibition_name: exhibitionName },
            update,
            options,
            (err, results) => {
              Exhibition.disconnectDB(() => {
                callback(err, results);
              });
            },
    );
  }

  /**
   * Deletes a specific Exhibition from the Database.
   * Does NOT delete any Attendance Document that references it.
   *
   * @param {String} exhibitionName: The name of the Exhibition to delete for.
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static deleteExhibition(exhibitionName, callback) {
    Exhibition.connectDB();
    this.ExhibitionModel.findOneAndRemove({ exhibition_name: exhibitionName }, (err) => {
      Exhibition.disconnectDB(() => {
        callback(err);
      });
    });
  }

  /**
   * Removes all Exhibitions from the Database.
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static clearAllExhibitions(callback) {
    Exhibition.connectDB();
    this.ExhibitionModel.collection.remove({}, (err) => {
      Exhibition.disconnectDB(() => {
        callback(err);
      });
    });
  }
}
module.exports = Exhibition;
