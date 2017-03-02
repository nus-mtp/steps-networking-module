const serverFilePath = '../../../server/';

const mongoDBConnector = require(serverFilePath + 'mongodbScripts/accessMongoDB');
const stepsUserSchema = require('./stepsUserSchema');
const stepsGuestSchema = require('./stepsGuestSchema');
const stepsModuleSchema = require('./stepsModuleSchema');
const stepsEventSchema = require('./stepsEventSchema');

/* 
    This file defines a Class Object that allows one to get the STePs Mongoose Models from a specified database.
*/
class StepsModelHandler {

    /*
        Initializes the ModelHandler with references to Mongoose Models.

        Starts a connection to the backend implicitly.
        
        @param {String} host: The String containing the name of the host that the MongoDB Server is running on.
        @param {String} port: The String containing the port number of the MongoDB Server process on host.
        @param {String} name: The String representing the name of the database to connect to.
    */
    constructor(host, port, name) {
        this.db = mongoDBConnector.connect(host, port, name);
        this.userModel = this.db.model('_User', stepsUserSchema);
        this.guestModel = this.db.model('Guest', stepsGuestSchema);
        this.moduleModel = this.db.model('Module', stepsModuleSchema);
        this.eventModel = this.db.model('Event', stepsEventSchema);
    }

    /*
        Returns an User Mongoose Model Object from the STePs DB - configured for the parameters specified in the constructor.

        @return {Mongoose.Model} userModel: The Mongoose Model that can be used to interact with the MongoDB backend.
    */
    getUserModel() {
        return this.userModel;
    }

    /*
        Returns a Guest Mongoose Model Object from the STePs DB - configured for the parameters specified in the constructor.

        @return {Mongoose.Model} guestModel: The Mongoose Model that can be used to interact with the MongoDB backend.
    */
    getGuestModel() {
        return this.guestModel;
    }

    /*
        Returns a Module Mongoose Model Object from the STePs DB - configured for the parameters specified in the constructor.

        @return {Mongoose.Model} moduleModel: The Mongoose Model that can be used to interact with the MongoDB backend.
    */
    getModuleModel() {
        return this.moduleModel;
    }

    /*
        Returns an Event Mongoose Model Object from the STePs DB - configured for the parameters specified in the constructor.

        @return {Mongoose.Model} eventModel: The Mongoose Model that can be used to interact with the MongoDB backend.
    */
    getEventModel() {
        return this.eventModel;
    }

    /*
        Closes the implicit backend connection.
        Needs to be called in order for the Node script to terminate.

        @param {function} callback: An optional function that can be sent in to execute after the db closes.
    */
    disconnect(callback) {
        this.db.close((err) => {
            if (err) console.log(err);

            if (typeof callback === 'function') callback();
        });
    }

}

module.exports = StepsModelHandler;