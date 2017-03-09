const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  event_name: {
    type: String,
    trim: true,
    unique: true,
    required: 'The Event Name is a Primary Key, and is therefore Required.',
    index: true,
  },
  event_description: String,
  start_date: {
    type: Date,
    default: Date.now,
  },
  end_date: {
    type: Date,
    default: () => {
      return Date.now() + (24 * 60 * 60 * 1000);
    }
  },
  event_location: String,
  event_map: String,
  event_picture: String,

  tags: [String],
});

module.exports = eventSchema;
