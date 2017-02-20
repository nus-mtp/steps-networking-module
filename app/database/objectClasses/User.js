class User {
    constructor(_id = "i0000", email = "email@email.com", name = "name", description = "description", hashed_pw = "password", will_notify = true, is_deleted = false, profile_pic = "url", skill_sets = [], bookedmarked_users = []) {
        this._id = _id;
        this.name = name;
        this.email = email;
        this.description= description;
        this.hashed_pw = hashed_pw;
        this.will_notfy = will_notify;
        this.is_deleted = is_deleted;
        this.profile_picture = profile_pic;
        this.skill_sets = skill_sets;
        this.bookmarked_users = bookedmarked_users;

    }
   
    /**
     * Getter methods
     **/
    
    /**
     * @return {string}
     */
    getName() {
        return this.name;
    }
    
    /** 
     * @return {string}
     */
    getEmail() {
        return this.email;
    }
    
    /**
     * @return {string}
     */
    getDescription() {
        return this.description;
    }
    
    /**
     * @return {string}
     */
    getHashedPW() {
        return this.hashed_pw;
    }
    
    /**
     * @return {boolean}
     */
    getWillNotify() {
        return this.will_notify;
    }
    
    /** 
     * @return {boolean}
     */
    getIsDeleted() {
        return this.is_deleted;
    }
    
    /**
     * @return {string}
     */
    getProfilePicture() {
        return this.profile_picture;
    }
    
    /**
     * @return {StringArray}
     */
    getSkillSets(){
        return this.skill_sets;
    }
    
    /**
     * @return {StringArray}
     */
    getBookmarkedUsers(){
        return this.bookmarked_users;
    }
    
    /**
     * Setter methods
     **/
    
    /**
     * @param {string}
     */
    setName(new_name) {
        this.name = new_name;
    }
    
    /**
     * @param {string}
     */
    setEmail(new_email) {
        this.email = new_email;
    }
    
    /**
     * @param {string}
     */
    setDescription(new_description) {
        this.description = new_description;
    }
    
    /**
     * @param {string}
     */
    setHashedPW(new_hashed_pw) {
        this.hashed_pw = new_hashed_pw;
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
}