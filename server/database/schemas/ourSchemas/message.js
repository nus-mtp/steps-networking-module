const mongoose = require('mongoose');
const postSchema = require('./post');

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

  messages: [
    postSchema,
  ],
});

messageSchema.index({ recipient_email: 1, sender_email: 1 }, { unique: true });

module.exports = messageSchema;
