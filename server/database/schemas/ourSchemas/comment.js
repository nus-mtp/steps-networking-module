const mongoose = require('mongoose');
const postSchema = require('./post');

const commentSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: 'The Email of the User who posted this Comment is used as a Foreign Key, and is t' +
        'herefore Required.',
  },
  exhibition_key: {
    type: mongoose.Schema.ObjectId,
    required: 'The Name of the Exhibition for which this Comment is posted under is used as a F' +
        'oreign Key, and is therefore Required.',
  },

  comments: [
    postSchema,
  ],
});

commentSchema.index({ user_email: 1, exhibition: 1 }, { unique: true });

module.exports = commentSchema;
