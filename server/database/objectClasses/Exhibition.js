const removeDuplicates = require('../../utils/utils').removeDuplicates;
const ModelHandler = require('../models/ourModels.js');

/**
 * This is the wrapper class used extract out and store information about the
 * Exhibitions from the Database between view and model.
 */

class Exhibition {
  /**
   * Establishes the Exhibition Model on an existing connection.
   *
   * @param {Mongoose.Connection} db: The connection to the db.
   */
  static setDBConnection(db) {
    if (!Exhibition.db || !Exhibition.ExhibitionModel) {
      Exhibition.db = db;
      Exhibition.ExhibitionModel = new ModelHandler().initWithConnection(db).getExhibitionModel();
    }
  }

  /**
   * A function which checks whether the Database connection can be used.
   *
   * @returns {Mongoose.Connection|*|*|Aggregate|Model|boolean}
   */
  static checkConnection() {
    return (Exhibition.db && Exhibition.ExhibitionModel &&
      (Exhibition.db.readyState === 1 || Exhibition.db.readyState === 2));
  }

  /**
   * Creates an Exhibition JSON and stores it internally.
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
    this.exhibitionJSON = {
      exhibition_name: exhibitionName,
      exhibition_description: exhibitionDescription,
      event_name: eventName,
      poster: posterURL,
      images,
      videos,
      website,
      tags: removeDuplicates(tags.map(tag => tag.trim().toLowerCase())),
    };
  }

  /**
   * Saves the Exhibition JSON to the database as an actual Document.
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  saveExhibition(callback) {
    if (Exhibition.checkConnection()) {
      const exhibitionDoc = new Exhibition.ExhibitionModel(this.exhibitionJSON);
      exhibitionDoc.save((err, result) => {
        callback(err, result);
      });
    } else {
      callback(null);
    }
  }

  /**
   * Checks whether the Exhibition exists within the Database. Will callback a boolean value.
   *
   * @param {String} eventName: The name of the Event that the Exhibition is held in.
   * @param {String} exhibitionName: The name of the Exhibition to search for.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static isExistingExhibition(eventName, exhibitionName, callback) {
    if (Exhibition.checkConnection()) {
      Exhibition.ExhibitionModel.findOne({ event_name: eventName, exhibition_name: exhibitionName },
            (err, exhibition) => {
              if (err) {
                callback(err, false);
              } else if (exhibition) {
                callback(null, true);
              } else {
                callback(null, false);
              }
            });
    } else {
      callback('Not Connected!', undefined);
    }
  }

  /**
   * Retrieve a specific Exhibition in the Database.
   *
   * @param {String} eventName: The name of the Event of which the Exhibition is held in.
   * @param {String} exhibitionName: The name of the Exhibition to retrieve from the Database.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static getExhibition(eventName, exhibitionName, callback) {
    if (Exhibition.checkConnection()) {
      Exhibition.ExhibitionModel.findOne({ event_name: eventName, exhibition_name: exhibitionName },
          (err, exhibition) => {
            callback(err, exhibition);
          });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve a specific Exhibition in the Database, using its Id.
   *
   * @param {mongoose.Schema.ObjectId} exhibitionId:
   *    The id of an Exhibition to search for.
   * @param {function} callback: A function that executes once the operation is done.
   */
  static getExhibitionById(exhibitionId, callback) {
    if (Exhibition.checkConnection()) {
      Exhibition.ExhibitionModel.findById(exhibitionId, (err, exhibition) => {
        callback(err, exhibition);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve all Exhibitions in the current Database.
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static getAllExhibitions(callback) {
    if (Exhibition.checkConnection()) {
      Exhibition.ExhibitionModel.find({}, (err, allExhibitions) => {
        callback(err, allExhibitions);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve all the Exhibitions tagged with the specified tag.
   *
   * @param {String} tag: The tag to check each Exhibition for.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static searchExhibitionsByTag(tag, callback) {
    if (Exhibition.checkConnection()) {
      Exhibition.ExhibitionModel.find({ tags: { $regex: new RegExp(tag.trim().toLowerCase().replace('+', '\\+'), 'i') } }, (err, matchedExhibitions) => {
        callback(err, matchedExhibitions);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Retrieve all the Exhibitions that is hosted under a single Event.
   *
   * @param {String} eventName: The unique name of the Event to search under.
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static searchExhibitionsByEvent(eventName, callback) {
    if (Exhibition.checkConnection()) {
      Exhibition.ExhibitionModel.find({ event_name: { $regex: new RegExp(eventName.replace('+', '\\+'), 'i') } }, (err, docs) => {
        callback(err, docs);
      });
    } else {
      callback('Not Connected!', null);
    }
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
    if (Exhibition.checkConnection()) {
      Exhibition.ExhibitionModel.findOne(
            { event_name: eventName, exhibition_name: exhibitionName },
            (err, exhibition) => {
              if (exhibition) {
                exhibition.set('tags', removeDuplicates(tags.map(tag => tag.trim().toLowerCase())));
                exhibition.save((err, updatedExhibition) => {
                  callback(err, updatedExhibition);
                });
              } else {
                callback(err, exhibition);
              }
            });
    } else {
      callback('Not Connected!', null);
    }
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
    if (Exhibition.checkConnection()) {
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
      Exhibition.ExhibitionModel
            .findOneAndUpdate({ exhibition_name: exhibitionName },
                update,
                options,
                (err, results) => {
                  callback(err, results);
                },
            );
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Deletes a specific Exhibition from the Database.
   * Does NOT delete any Attendance Document that references it.
   *
   * @param {String} exhibitionName: The name of the Exhibition to delete for.
   * @param {function} callback: A function that is executed once the operation has completed.
   */
  static deleteExhibition(exhibitionName, callback) {
    if (Exhibition.checkConnection()) {
      Exhibition.ExhibitionModel.findOneAndRemove({ exhibition_name: exhibitionName }, (err) => {
        callback(err);
      });
    } else {
      callback('Not Connected!', null);
    }
  }

  /**
   * Removes all Exhibitions from the Database.
   *
   * @param {function} callback: A function that is executed once the operation is done.
   */
  static clearAllExhibitions(callback) {
    if (Exhibition.checkConnection()) {
      Exhibition.ExhibitionModel.collection.remove({}, (err) => {
        callback(err);
      });
    } else {
      callback('Not Connected!', null);
    }
  }
}
module.exports = Exhibition;
