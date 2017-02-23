var ModelHandler = require("../mongodbscripts/models.js");
const port = "27017";
const host = "localhost";
const dbName = "fake-data";

/**
 * This is the wrapper class used extract out and store information about the Users from the database between view and model
 *
 */


class User {
  constructor(email = "", name = "", description = "", hashed_pw = "", will_notify = true, is_deleted = false, profile_pic = "", skill_sets = [], bookedmarked_users = []) {
    this.ModelHandler = new ModelHandler (host, port, dbName);
    this.userModel = this.ModelHandler.getUserModel();
    this.userModelDoc = new this.userModel({
      email : email,
      name : name,
      description : description,
      hashed_pw : hashed_pw,
      will_notfy : will_notify,
      is_deleted : is_deleted,
      profile_picture : profile_pic,
      skills : skill_sets,
      bookmarked_users : bookedmarked_users,
    });
    this.saveUser();
    this.ModelHandler.disconnect();
  }


  /**
  * Takes in password from user and checks the hashed version with the databse
  * 
  * @param {string} password
  * @param {function} callback
  */
  comparePassword(password, callback){
    this.userModelDoc.comparePassword(password, callback);
  }

  /**
   * Saves users into database
   */
  saveUser(){
    this.userModelDoc.save(function (err) {
      if (err)
        throw (err);
      // saved!
    })    
  }

  /**
   * Remove the collection of Users from database
   */
  static clearAllUser(){
    this.ModelHandler = new ModelHandler (host, port, dbName);
    this.userModel = this.ModelHandler.getUserModel();
    this.userModel.collection.remove({});
    this.ModelHandler.disconnect();
  }

  /**
   *Returns the entire collection of Users
   */
  static getAllUsers(cb){
    this.ModelHandler = new ModelHandler (host, port, dbName);
    this.userModel = this.ModelHandler.getUserModel();
    var userArray = this.userModel.find({},function (err,userDoc){
      if (err){
        cb(err,null);
      } else{
        cb(null,userDoc);
      }
    });
    this.ModelHandler.disconnect();
  }

  /**
   * This method takes in an email and returns a match in the database
   * To use this function use 
     getUser(email, function functionName(err, doc){
       if (err){
         //error handling
       }
       //do anything to doc here. doc is the UserObject.
     });
   *  
   * @param {String} email
   * @param {function} cb
   **/
  static getUser(email, cb){
    var results;
    this.ModelHandler = new ModelHandler (host, port, dbName);
    this.userModel = this.ModelHandler.getUserModel();
    this.userModel.findOne({ 'email': email }, function(err, docs) {
      if (err){
        console.log("problem");
        throw err;
      }
      cb(userDoc);
    });
    this.ModelHandler.disconnect();
  }

}
module.exports = User;
