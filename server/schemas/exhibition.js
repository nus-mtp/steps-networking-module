var mongoose = require('mongoose');

var exhibitionSchema = new mongoose.Schema({
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

module.exports = exhibitionSchema;