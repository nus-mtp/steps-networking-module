const serverFilePath = '../../../server/';

const mongoDBConnector = require(serverFilePath + 'mongodbScripts/accessMongoDB.js');
const userSchema = require(serverFilePath + 'schemas/user.js');
const eventSchema = require(serverFilePath + 'schemas/event.js');
const exhibitionSchema = require(serverFilePath + 'schemas/exhibition.js');
const attendanceSchema = require(serverFilePath + 'schemas/attendance.js');
const commentSchema = require(serverFilePath + 'schemas/comment.js');

/* 
    This file defines a Class Object that allows one to get our Mongoose Models from a specified database.
*/
class ModelHandler {

    /*
        Initializes the ModelHandler with references to Mongoose Models.

        Starts a connection to the backend implicitly.
        
        @param {String} host: The String containing the name of the host that the MongoDB Server is running on.
        @param {String} port: The String containing the port number of the MongoDB Server process on host.
        @param {String} name: The String representing the name of the database to connect to.
    */
    constructor(host, port, name) {
        this.db = mongoDBConnector.connect(host, port, name);
        this.userModel = this.db.model('user', userSchema);
        this.eventModel = this.db.model('event', eventSchema);
        this.exhibitionModel = this.db.model('exhibition', exhibitionSchema);
        this.attendanceModel = this.db.model('attendance', attendanceSchema);
        this.commentModel = this.db.model('comment', commentSchema);
    }

    /*
        Returns a User Mongoose Model Object - configured for the parameters specified in the constructor.

        @return {Mongoose.Model} userModel: The Mongoose Model that can be used to interact with the MongoDB backend.
    */
    getUserModel() {
        return this.userModel;
    }

    /*
        Returns a Event Mongoose Model Object - configured for the parameters specified in the constructor.

        @return {Mongoose.Model} eventModel: The Mongoose Model that can be used to interact with the MongoDB backend.
    */
    getEventModel() {
        return this.eventModel;
    }

    /*
        Returns a Exhibition Mongoose Model Object - configured for the parameters specified in the constructor.

        @return {Mongoose.Model} exhibitionModel: The Mongoose Model that can be used to interact with the MongoDB backend.
    */
    getExhibitionModel() {
        return this.exhibitionModel;
    }

    /*
        Returns a Attendance Mongoose Model Object - configured for the parameters specified in the constructor.

        @return {Mongoose.Model} attendanceModel: The Mongoose Model that can be used to interact with the MongoDB backend.
    */
    getAttendanceModel() {
        return this.attendanceModel;
    }

    /*
        Returns a Comment Mongoose Model Object - configured for the parameters specified in the constructor.

        @return {Mongoose.Model} commentModel: The Mongoose Model that can be used to interact with the MongoDB backend.
    */
    getCommentModel() {
        return this.commentModel;
    }

    /*
        Closes the implicit backend connection.
        Needs to be called in order for the Node script to terminate.

        @param {function} callback: An optional function that can be sent in to execute after the db closes.
    */
    disconnect(callback) {
        this.db.close(function(err) {
            if (err) console.log(err);

            if (typeof callback === 'function') callback();
        });
    }

}

module.exports = ModelHandler;