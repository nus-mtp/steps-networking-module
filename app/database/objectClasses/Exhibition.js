const ModelHandler = require('../../../server/database/models/ourModels.js');

const port = "27017";
const host = "localhost";
const dbName = "fake-data";

/**
 * This is the wrapper class used extract out and store information about the Exhibitions from the database between view and model
 *
 */

class Exhibition{
  /**
   * Creates an model instance.
   * 
   * @param {String} exhibitionName: Unique identifier for the object
   * @param {String} exhibitionDescription: Description for the event
   * @param {String} eventName: Name of the event that the exhibition is found in
   * @param {StringArray} images: list of url for images to be found.
   * @param {StringArray} videos: list of url for videos to be found.
   * @param {String} website: url for the exhibition page
   * @param {String Array} tags: Tags used to identify exhibitions
   */
  constructor(exhibitionName = "", exhibitionDescription = "", eventName, images, videos, website, tags) {
    this.ModelHandler = new ModelHandler (host, port, dbName);
    this.exhibModel = this.ModelHandler.getExhibitionModel();
    this.exhibModelDoc = new this.exhibModel({  
      exhibition_name: exhibitionName,
      exhibition_description:exhibitionDescription,
      event_name: eventName,
      images: images,
      videos: videos,
      website: website,
      tags: tags
    });
    this.ModelHandler.disconnect();
  }

  /**
   * saves exhibition into Database
   *
   * @param {function} callback: used for error checking
   */
  saveExhibition(callback){
    Exhibition.connectDB();
    this.exhibModelDoc.save(function(err){
      callback(err);
    });
    Exhibition.disconnectDB();
  }

  static connectDB(){
    this.ModelHandler = new ModelHandler (host, port, dbName);
    this.exhibModel = this.ModelHandler.getExhibitionModel();
  }

  static disconnectDB(){
    this.ModelHandler.disconnect();
  }

  /**
   * Removes all exhibitions from the Database
   *
   * @param {function} callback: used for error checking
   */
  static clearAllExhibitions(callback){
    Exhibition.connectDB();
    this.exhibModel.collection.remove({},callback);
    Exhibition.disconnectDB();
  }

  /**
   * Removes a specific exhibition from the Database
   *
   * @param {function} callback: used for error checking
   */
  static deleteExhibition(exhibitionName, callback){
    Exhibition.connectDB();
    this.exhibModel.findOneAndRemove({exhibition_name: exhibitionName}, function (err){
      if (err){
        callback(err);
      }
    });
    Exhibition.disconnectDB();
  }

  /**
   * Retrieve all the exhibition listed in the database
   *
   * @param {function} callback: used for error checking
   */
  static getAllExhibition(callback){
    Exhibition.connectDB();
    this.exhibModel.find({}, function(err, exhibtObj){
      if (err){
        callback(err,null);
      } else {
        //exhibObj is an array of Exhibition objects
        callback(null, exhibObj);
      }
    });
    Exhibition.disconnectDB();
  }

  /**
   * Retrieve a specific exhibit listed in the database
   *
   * @param {function} callback: used for error checking
   */
  static getExhibition (exhibitionName, callback){
    Exhibition.connectDB();
    this.exhibModel.findOne({'exhibition_name': exhibitionName},function (err, exhibObj){
      if (err){
        callback(err, null);
      } else {
        callback(null, exhibObj);
      }
    });
    Exhibition.disconnectDB();
  }

  /**
   * updates an model instance.
   * 
   * @param {String} exhibitionName: Unique identifier for the object
   * @param {String} exhibitionDescription: Description for the event
   * @param {String} eventName: Name of the event that the exhibition is found in
   * @param {StringArray} images: list of url for images to be found.
   * @param {StringArray} videos: list of url for videos to be found.
   * @param {String} website: url for the exhibition page
   * @param {String Array} tags: Tags used to identify exhibitions
   * @param {function} callback: used for error checking
   */
  static updateExhibition(exhibitionName = "", exhibitionDescription = "", eventName, images, videos, website, tags, callback) {
    Exhibition.connectDB();
    var update = {exhibition_name: exhibitionName,
                  exhibition_description:exhibitionDescription,
                  event_name: eventName,
                  images: images,
                  videos: videos,
                  website: website,
                  tags: tags
                 };
    var options = {new: true};
    this.exhibModel.findOneAndUpdate({'exhibition_name': exhibitionName}, update, options, function (err, results){
      if (err){
        console.log("Unable to update exhibition");
        callback(err);
      } else if (results) {
        console.log("Exhibition is updated.");
      } else {
        console.log("There is no such exhibition.");
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
  static isExistingExhibition(exhibitionName, callback){
    Exhibition.connectDB();
    this.exhibModel.findOne({'exhibition_name': exhibitionName}, function (err, docs){
      if (err){
        callback(err, null)
      } else if (docs){
        callback (null, true);
      } else {
        callback (null, false);
      }
    });
    Exhibition.disconnectDB();
  }

  /**
   * Retrieve all the event with the specificed tag listed in the database
   *
   * @param {String} eventName: unique identifer used to check against database
   * @param {function} callback: used for error checking
   */
  static searchExhibitionsByTag(tag, callback){
    Exhibition.connectDB();
    this.exhibModel.find({'tags': { $regex: new RegExp(tag.replace('+',"\\+"),"i")} }, function (err, docs){
      if (err){
        callback (err, null);
      } else {
        callback (null, docs);
      }
    });
    Exhibition.disconnectDB();
  }
  
    /**
   * Retrieve all the event with the specificed tag listed in the database
   *
   * @param {String} eventName: unique identifer used to check against database
   * @param {function} callback: used for error checking
   */
  static searchExhibitionsByEvent(eventName, callback){
    Exhibition.connectDB();
    this.exhibModel.find({'event_name': { $regex: new RegExp(eventName.replace('+',"\\+"),"i")} }, function (err, docs){
      if (err){
        callback (err, null);
      } else {
        callback (null, docs);
      }
    });
    Exhibition.disconnectDB();
  }
}
module.exports = Exhibition;
