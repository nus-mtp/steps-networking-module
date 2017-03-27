const mongoose = require('mongoose');

const exhibitionSchema = new mongoose.Schema({
  exhibition_name: {
    type: String,
    trim: true,
    required: 'The Exhibition Name is a part of a Composite Key, and is therefore Required.',
  },

  event_name: {
    type: String,
    trim: true,
    required: 'The Name of the Event for which this Exhibition is hosted under is part of a Composite Key' +
        ', and is therefore Required.',
  },

  exhibition_description: String,

  poster: String,
  images: [String],
  videos: [String],
  website: String,

  tags: [
    {
      type: String,
      lowercase: true,
      trim: true,
      // unique: true,
    },
  ],
});

exhibitionSchema.index({ event_name: 1, exhibition_name: 1 }, { unique: true });

module.exports = exhibitionSchema;
