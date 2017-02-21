var Schema = require("./schemaHeader.js");

var eventSchema = new Schema({
    event_name: {
        type: String,
        index: { unique: true }
    },
    event_description: String,
    start_date: Date,
    end_date: Date,
    event_location: String,
    event_map: String,
    event_picture: String,

    tags: [String]
});

module.exports = eventSchema;