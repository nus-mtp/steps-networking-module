const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = postSchema;
