var mongoDBConnector = require("../mongodbscripts/accessMongoDB.js");
var userSchema = require("../schemas/userSchema.js");
var eventSchema = require("../schemas/eventSchema.js");

/* 
    This file defines a Class Object that allows one to get the Mongoose Models from a specified database.
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
        this.userModel = this.db.model("user", userSchema);
        this.eventModel = this.db.model("event", eventSchema);
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

        @return {Mongoose.Model} userModel: The Mongoose Model that can be used to interact with the MongoDB backend.
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
        this.db.close(function(err) {
            if (err) console.log(err);

            if (typeof callback === "function") callback();
        });
    }

}

module.exports = ModelHandler;