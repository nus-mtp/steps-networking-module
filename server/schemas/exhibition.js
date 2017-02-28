var mongoose = require('mongoose');

var exhibitionSchema = new mongoose.Schema({
    exhibition_name: {
        type: String,
        trim: true,
        unique: true,
        required: "The Exhibition Name is a Primary Key, and is therefore Required.",
        index: true,
    },
    exhibition_description: String,

    event_name: {
        type: String,
        trim: true,
        required: "The Name of the Event for which this Exhibition is hosted under is a Foreign Key, and is therefore Required.",
        index: true,
    },

    images: [String],
    videos: [String],
    website: String,

    tags: [{
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
    }]
});

module.exports = exhibitionSchema;