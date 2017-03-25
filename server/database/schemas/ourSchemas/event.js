const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  event_name: {
    type: String,
    trim: true,
    unique: true,
    required: 'The Event Name is a Primary Key, and is therefore Required.',
  },
  event_description: String,
  start_date: {
    type: Date,
    default: Date.now,
  },
  end_date: {
    type: Date,
    default: () => Date.now() + (24 * 60 * 60 * 1000),
  },
  event_location: String,
  event_map: String,
  event_picture: String,

  tags: [
    {
      type: String,
      lowercase: true,
      trim: true,
      // unique: true,
    },
  ],
});

module.exports = eventSchema;
