const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  event_name: {
    type: String,
    trim: true,
    unique: true,
    required: 'The Event Name is a Primary Key, and is therefore Required.',
  },
  event_description: {
    type: String,
  },
  start_date: {
    type: Date,
    default: Date.now,
  },
  end_date: {
    type: Date,
    default: () => Date.now() + (24 * 60 * 60 * 1000),
  },
  event_location: {
    type: String,
  },
  event_map: {
    type: String,
  },
  event_picture: {
    type: String,
  },
  tags: [
    {
      type: String,
      lowercase: true,
      trim: true,
    },
  ],
});

module.exports = eventSchema;
