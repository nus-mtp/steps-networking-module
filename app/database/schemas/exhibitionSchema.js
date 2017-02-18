var Schema = require("./schemaHeader.js");

var exhibitionSchema = new Schema({
    exhibition_name: {
        type: String,
        index: { unique: true }
    },
    exhibition_description: String,

    event_name: String,

    images: [String],
    videos: [String],
    website: String,

    tags: [String]
});