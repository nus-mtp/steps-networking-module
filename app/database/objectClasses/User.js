var ModelHandler = require("../mongodbscripts/models.js");

/**
 * This is the wrapper class used extract out information from the database between view and model
 *
 */


class User {
  constructor(email = "", name = "", description = "", hashed_pw = "", will_notify = true, is_deleted = false, profile_pic = "", skill_sets = [], bookedmarked_users = []) {
    var port = "27017";
    var host = "localhost";
    var dbName = "fake-data";
    console.log("default name is : "+name);
    ModelHandler = new ModelHandler (host, port, dbName);
    this.userModel = ModelHandler.getUserModel();
    //this.clearUser();
    this.userModelDoc = new this.userModel({
      email : email,
      name : name,
      description : description,
      hashed_pw : hashed_pw,
      will_notfy : will_notify,
      is_deleted : is_deleted,
      profile_picture : profile_pic,
      skill_sets : skill_sets,
      bookmarked_users : bookedmarked_users,
    });
    this.saveUser();
  }

  /**
   * Getter methods
   **/

  /**
   * @return {string}
   */
  getName() {
    return this.userModelDoc.name;
  }

  /** 
   * @return {string}
   */
  getEmail() {
    return this.userModelDoc.email;
  }

  /**
   * @return {string}
   */
  getDescription() {
    return this.userModelDoc.description;
  }

  /**
   * @return {string}
   */
  getHashedPW() {
    return this.userModelDoc.hashed_pw;
  }

  /**
   * @return {boolean}
   */
  getWillNotify() {
    return this.userModelDoc.will_notify;
  }

  /** 
   * @return {boolean}
   */
  getIsDeleted() {
    return this.userModelDoc.is_deleted;
  }

  /**
   * @return {string}
   */
  getProfilePicture() {
    return this.userModelDoc.profile_picture;
  }

  /**
   * @return {StringArray}
   */
  getSkillSets(){
    return this.userModelDoc.skill_sets;
  }

  /**
   * @return {StringArray}
   */
  getBookmarkedUsers(){
    return this.userModelDoc.bookmarked_users;
  }

  /**
   * Setter methods
   **/

  /**
   * @param {string}
   */
  setName(new_name) {
    this.userModelDoc.name = new_name;
  }

  /**
   * @param {string}
   */
  setEmail(new_email) {
    this.userModelDoc.email = new_email;
  }

  /**
   * @param {string}
   */
  setDescription(new_description) {
    this.userModelDoc.description = new_description;
  }

  /**
   * @param {string}
   */
  setHashedPW(new_hashed_pw) {
    this.userModelDoc.hashed_pw = new_hashed_pw;
  }

  /**
   * @param {boolean}
   */
  setWillNotify(new_will_notify) {
    this.will_notfy = new_will_notify;
  }

  /**
   * @param {boolean}
   */
  setIsDeleted(new_is_deleted) {
    this.is_deleted = new_is_deleted;
  }

  /**
   * @param {string}
   */
  setProfile_picture(new_URL) {
    this.profile_picture = new_URL;
  }

  /**
   * @param {StringArray}
   */
  setSkillSets(new_skills_set){
    this.skill_sets = new_skills_set;
  }

  /**
   * @param {StringArray}
   */
  setBookmarkedUsers(new_bookmarked_users){
    this.bookmarked_users = new_bookmarked_users;
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

  saveUser(){
    this.userModelDoc.save(function (err) {
      if (err)
        throw (err);
      // saved!
    })    
  }

  clearUser(){
    this.userModel.collection.remove();
  }
}

module.exports = User;