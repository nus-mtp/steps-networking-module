const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  recipient_email: {
    type: String,
    trim: true,
    required: 'The Recipient\'s Email is used as a Foreign Key, and is therefore Required.',
  },
  sender_email: {
    type: String,
    trim: true,
    required: 'The Sender\'s Email is used as a Foreign Key, and is therefore Required.',
  },

  content: String,

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = messageSchema;
