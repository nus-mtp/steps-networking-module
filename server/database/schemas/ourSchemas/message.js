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

messageSchema.index({ recipient_email: 1, sender_email: 1, timestamp: 1 }, { unique: true });

module.exports = messageSchema;
