var ModelHandler = require("../mongodbscripts/models.js");
const port = "27017";
const host = "localhost";
const dbName = "fake-data";

/**
 * This is the wrapper class used extract out and store information about the Users from the database between view and model
 *
 */


class User {
  
  /**
   * This method creates a new instance of the model, returns .
   *
   * @param {String} email: Email used to register in the respective events
   * @param {String} name
   * @param {String} description
   * @param {String} password
   * @param {Boolean} will_notify: To determine if the user wants to be notified of new messages by email
   * @param {Boolean} is_deleted: To determine if this user is still valid in the database
   * @param {String} profile_pic: A url string which contains the profile picture.11
   * @param {StringArray} skills_set: The skills that the user possess. Such as programming skills, management skills, etc
   * @param {StringArray} bookedmarked_users: A collection of users' emails that the current user wants to keep track of.
   */
  constructor(email = "", name = "", description = "", password = "", will_notify = true, is_deleted = false, profile_pic = "", skill_sets = [], bookedmarked_users = []) {
    this.ModelHandler = new ModelHandler (host, port, dbName);
    this.userModel = this.ModelHandler.getUserModel();
    this.userModelDoc = new this.userModel({
      email : email,
      name : name,
      description : description,
      password : password,
      will_notify : will_notify,
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
   * Report if there's any duplicate
   */
  saveUser(){
    this.userModelDoc.save(function (err) {
      if (err) {

        //Is there an existing User?
        if (err.name === 'MongoError' && err.code === 11000) {
          console.log("There is an existing user with the same Email.");
        }
      } else {
        console.log("Users are saved.");
      }
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
   * Returns the entire collection of Users
   * To use this function use
   * User.getAllUsers(function functionName(err,obj) {
        if (err){
        //error handling
        } else {
        // do anything to obj. obj is an array of documents.
        }
     });
   */
  static getAllUsers(cb){
    this.ModelHandler = new ModelHandler (host, port, dbName);
    this.userModel = this.ModelHandler.getUserModel();
    this.userModel.find({},function (err,userDoc){
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
   * getUser(email, function functionName(err, docs){
       if (err){
         //error handling
       } else {
       //do anything to doc here. docs is the UserObject.
       //To access attribute, use docs.[attribute];
       }
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
        cb(err, null)
      }
      cb(null,docs);
    });
    this.ModelHandler.disconnect();
  }

  /**
   * This method updates overwrites all the current attribute content (except email) with the user input content 
   *
   * @param {String} email: used as an identifer for the respective user instance
   * @param {String} name
   * @param {String} description
   * @param {String} password
   * @param {Boolean} will_notify: To determine if the user wants to be notified of new messages by email
   * @param {Boolean} is_deleted: To determine if this user is still valid in the database
   * @param {String} profile_pic: A url string which contains the profile picture.11
   * @param {StringArray} skills_set: The skills that the user possess. Such as programming skills, management skills, etc
   * @param {StringArray} bookedmarked_users: A collection of users' emails that the current user wants to keep track of.
   **/
  static updateUser(email = "", name = "", description = "", password = "", will_notify = true, is_deleted = false, profile_pic = "", skill_sets = [], bookedmarked_users = []){
    
    //The list of  
    var update = { name : name,
      description : description,
      password : password,
      will_notify : will_notify,
      is_deleted : is_deleted,
      profile_picture : profile_pic,
      skills : skill_sets,
      bookmarked_users : bookedmarked_users,
    }
    var options = {new: true};
    this.ModelHandler = new ModelHandler (host, port, dbName);
    this.userModel = this.ModelHandler.getUserModel();
    this.userModel.findOneAndUpdate({ 'email': email }, update, options, function(err, docs) {
      if (err){
        console.log("Error with updating users.");
      } else {
        console.log ("User is updated successfully");
      }
    });
    this.ModelHandler.disconnect();
  }
}
module.exports = User;
